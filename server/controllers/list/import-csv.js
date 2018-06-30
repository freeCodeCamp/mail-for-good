const path = require('path');
const csv = require('csv');
const fs = require('fs');
const cargo = require('async/cargo');
const _ = require('lodash');
const shortid = require('shortid');
const emailValidator = require('email-validator');

const db = require('../../models');
const sendSingleNotification = require('../websockets/send-single-notification');
const sendUpdateNotification = require('../websockets/send-update-notification');

// Expects req.body.headers (JSON array), req,body.list (string), req.file (csv file)
/* Example req.file
    { fieldname: 'csv',
      originalname: 'big.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: 'uploads/',
      filename: '50b2376243290582bb1583caaab5d217',
      path: 'server/uploads/50b2376243290582bb1583caaab5d217',
      size: 50173280
    }
*/

module.exports = (req, res, io) => {
  /*
    Steps in this file
    1. Check if the list (req.body.list) exists. If so, use it. If not, create it.
    2. Iterate through the CSV file based on the concurrency set in const concurrency.
    3. Using the instance of the list table upsert rows to the listsubscriber(s) table, providing a foreign key from the list instance.
  */

  const listName = req.body.list; // Name of the list from the user
  const additionalFields = _.without(JSON.parse(req.body.headers), 'email'); // e.g. name, location, sex, (excluding email header)
  const userId = req.user.id;

  // Validate the list name. This should also be handled client side so there's no need for a message response.
  if (listName === '') {
    res.status(400).send();
    return;
  }

  const validateListBelongsToUser = db.list.findOrCreate({
    where: {
      name: listName,
      userId: userId
    },
    defaults: {
      additionalFields
    }
  }).then(listInstance => {
    if (listInstance) {
      return listInstance;
    } else {
      return false;
    }
  }, err => {
    return err;
  });

  const validateCsvDoesNotContainErrors = new Promise((resolve, reject) => {
    const notification = {
      message: 'Validating CSV ...',
      icon: 'fa-list-alt',
      iconColour: 'text-green',
    };

    sendSingleNotification(io, req, notification);
    let currentLine = 1; // The current parsed line no.
    const randomId = shortid.generate();
    // Parse the CSV in full & check for any error prior to doing any work
    const parser = csv.parse({columns: true, skip_empty_lines: true});
    fs.createReadStream(`${path.resolve(req.file.path)}`)
      .pipe(parser)
      .on('data', () => {
        if (currentLine % 1000 === 0) {
          const notification = {
            message :`Validated ${currentLine.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows`,
            id: randomId, // Unique identified for use on client side (in the reducer)
            icon: 'fa-upload',
            iconColour: 'text-blue'
          };

          sendUpdateNotification(io, req, notification);
        }

        currentLine++;
      })
      .on('error', err => {
        const notification = {
          message: `${err}`,
          icon: 'fa-list-alt',
          iconColour: 'text-red',
        };

        sendSingleNotification(io, req, notification);
        console.log(err);
        res.status(400).send({ message: err.message });
        reject(err);
      })
      .on('finish', () => {
        const notification = {
          message: `CSV validated (${currentLine} rows)`,
          icon: 'fa-list-alt',
          iconColour: 'text-green',
        };

        sendSingleNotification(io, req, notification);
        resolve();
      });
  });

  Promise.all([validateListBelongsToUser, validateCsvDoesNotContainErrors])
  .then(values => {
    let [listInstance] = values; // Get variables from the values array
    const randomId = shortid.generate();

    listInstance = listInstance[0];
    const listIsNew = listInstance.$options.isNewRecord;
    const listId = listInstance.dataValues.id;

    const filename = req.file.originalname;
    let bufferArray = [];
    const bufferLength = 1000;
    let numberProcessed = 0; // Var for tracking how many CSVs have been processed. Sends a WS notification per 'bufferLength' processed emails.

    function sendFinalNotification() {
      // Truncate filename
      let filenameWithoutExtension = filename.substr(0, filename.lastIndexOf('.'));
      filenameWithoutExtension = filenameWithoutExtension.length > 10
        ? `${filenameWithoutExtension.substr(0, 10)}...`
        : filenameWithoutExtension;

      const notification = {
        message: `"${filenameWithoutExtension}" successfully uploaded (${numberProcessed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows)`,
        icon: 'fa-list-alt',
        iconColour: 'text-green',
        newDataToFetch: 'lists',  // A client side resource to be updated, e.g. 'campaigns'
        url: `/lists/manage/${listId}`  // User is redirected to this (relative) url when they dismiss a notification
      };

      sendSingleNotification(io, req, notification);
    }

    function updateListStatusReady() {
      db.listsubscriber.count({
        where: { listId: listId }
      }).then(total => {
        db.list.update(
          { status: 'ready', total }, { where: { id: listId } }
        ).then(() => {
          console.log('Updated list status to ready'); // eslint-disable-line
        }).catch(err => {
          throw err;
        });
      });
    }

    function returnUniqueItems(model, records) {
      // @params model = a sequelize db model
      // @params records = an array of rows to upsert
      // Returns unique items in the records array

      // First remove duplicate emails from the records
      records = _.uniqBy(records, 'email');

      // Now verify that the remaining records do not exist in the db
      const promiseArrayOfUniqueRecords = records.map(row => {
        // Will return null if email exists, and the row if it doesn't
        return new Promise(resolve => {
          model.findOne({
            where: {
              listId,
              email: row.email
            }
          }).then(instance => {
            if (instance) // Email already exists
              resolve(null);
            else
              resolve(row);
            }
          );
        });
      });

      // When the process above is complete, eliminate duplicates that are now 'null'
      const uniqueEmails = new Promise(resolve => {
        Promise.all(promiseArrayOfUniqueRecords).then(values => resolve(values.filter(x => x !== null)));
      });

      // Return the wrapped promise
      return uniqueEmails;
    }

    const c = cargo((tasks, callback) => {
      const tasksLength = tasks.length;
      returnUniqueItems(db.listsubscriber, tasks).then(uniqueTasks => {
        db.listsubscriber.bulkCreate(uniqueTasks).then(() => {

          // Track how many emails we've processed so far.
          numberProcessed += tasksLength;

          // Send a notification if this isn't the final batch (since if it is, the user will receive a 'success')
          if (tasksLength === bufferLength) {
            const notification = {
              message :`Processed ${numberProcessed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows...`,
              id: randomId, // Unique identified for use on client side (in the reducer)
              icon: 'fa-upload',
              iconColour: 'text-blue'
            };

            sendUpdateNotification(io, req, notification);
          } else {
            finishSend();
          }

          callback();
          return null;
        }).catch(err => {
          console.log(`Error on bulkCreate of CSV import - ${err}`); // eslint-disable-line
        });
      });
    }, bufferLength);

    function finishSend() {
      // Finish when queue empties
      const fin = () => setTimeout(() => {
        updateListStatusReady();
        sendFinalNotification();
      }, 1000);

      if (c.length()) {
        c.drain(() => {
          fin();
        });
      } else {
        fin();
      }
    }

    /* Config csv parser */
    const parser = csv.parse({columns: true, skip_empty_lines: true}); // Write object with headers as object keys, and skip empty rows
    const transformerOptions = {
      parallel: bufferLength
    };
    /* ///////////////// */

    const transformer = csv.transform((row, callback) => {
      // If row has no email field (though it should), skip the line. Implicit conversion from both undefined & '' is assumed.
      if (!row.email || !emailValidator.validate(row.email)) {
        callback();
      } else {
        // Add fields to row
        bufferArray.push({
          listId,
          email: row.email,
          additionalData: _.omit(row, 'email')
        });

        if (bufferArray.length >= bufferLength) {
          // Check that the cargo process isn't overloaded. If it is (length > bufferLength * 3)
          c.push(bufferArray, err => {
            if (err)
              throw err;
            callback();
          });
          bufferArray = [];
        } else {
          callback();
        }
      }
    }, transformerOptions);

    transformer.on('error', err => {
      // Catch errs
      console.log(err);
    });

    // Create read stream, parse then pipe to transformer to perform async operations. Finally, release data for garbage collection.
    fs.createReadStream(`${path.resolve(req.file.path)}`).pipe(parser).pipe(transformer).on('data', () => {
      // Do nothing with the data. Let it be garbage collected.
    }).on('finish', () => {
      // Delete CSV
      fs.unlink(`${path.resolve(req.file.path)}`, err => {
        if (err)
          throw err;

        // If bufferArray.length != 0, there are still some emails to save
        if (bufferArray.length) {
          c.push(bufferArray, err => {
            if (err)
              throw err;
            }
          );
          bufferArray = [];
        } else {
          finishSend();
        }
      });
    });

    const message = listIsNew
      ? `List: ${listName} - Successfully created`
      : `List: ${listName} - Successfully updated`;
    res.status(202).send({message: message});

    return null;
  })
  .catch(err => {
    res.status(400).send({ message: err.message });
  });
};