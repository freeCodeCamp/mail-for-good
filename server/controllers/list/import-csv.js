const path = require('path');
const csv = require('csv');
const fs = require('fs');
const cargo = require('async/cargo');
const _ = require('lodash');

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
        Outstanding issues:
        TODO: TSV & other files are not accounted for. The current method only works with CSV files. There's also no current validation of CSV files in terms of both the information within and the actual file type.
        TODO: Validate additional fields
    */

  /*
        Steps in this file
        1. Check if the list (req.body.list) exists. If so, use it. If not, create it.
        2. Iterate through the CSV file based on the concurrency set in const concurrency.
        3. Using the instance of the list table upsert rows to the listsubscriber(s) table, providing a foreign key from the list instance.
    */

  const listName = req.body.list; // Name of the list from the user
  const additionalFields = _.without(JSON.parse(req.body.headers), 'email'); // e.g. name, location, sex, (excluding email header)
  const userId = req.user.id;

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

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
    throw err;
  });

  Promise.all([validateListBelongsToUser]).then(values => {
    let [listInstance] = values; // Get variables from the values array
    const crudeRandomId = (Math.random() * 100000).toString(); // This doesn't really need to be unique as only one CSV should ever be uploaded at any one time by a client

    listInstance = listInstance[0];
    const listIsNew = listInstance.$options.isNewRecord;
    const listId = listInstance.dataValues.id;

    const filename = req.file.originalname;
    let bufferArray = [];
    const bufferLength = 2500;
    let numberProcessed = 0; // Var for tracking how many CSVs have been processed. Sends a WS notification per 'bufferLength' processed emails.

    function sendFinalNotification() {
      // Truncate filename
      let filenameWithoutExtension = filename.substr(0, filename.lastIndexOf('.'));
      filenameWithoutExtension = filenameWithoutExtension.length > 10
        ? `${filenameWithoutExtension.substr(0, 10)}...`
        : filenameWithoutExtension;

      const ioSocket = io.sockets.connected[req.session.passport.socket];
      const message = `"${filenameWithoutExtension}" successfully uploaded (${numberProcessed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows)`;
      const icon = 'fa-list-alt';
      const iconColour = 'text-green';
      const newDataToFetch = 'lists';
      const url = `/lists/manage/${listId}`;

      sendSingleNotification(ioSocket, message, icon, iconColour, newDataToFetch, url);
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
            const ioSocket = io.sockets.connected[req.session.passport.socket];
            const message = `Processed ${numberProcessed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows...`;
            const icon = 'fa-upload';
            const iconColour = 'text-blue';
            const id = crudeRandomId;

            sendUpdateNotification(ioSocket, message, icon, iconColour, id);
          } else {
            updateListStatusReady();
            sendFinalNotification();
          }

          callback();
          return null;
        }).catch(err => {
          console.log(`Error on bulkCreate of CSV import - ${err}`); // eslint-disable-line
        });
      });
    }, bufferLength);

    /* Config csv parser */
    const parser = csv.parse({columns: true, skip_empty_lines: true}); // Write object with headers as object keys, and skip empty rows
    const transformerOptions = {
      parallel: bufferLength
    };
    /* ///////////////// */

    const transformer = csv.transform((row, callback) => {
      // If row has no email field (though it should), skip the line. Implicit conversion from both undefined & '' is assumed.
      if (!row.email || !validateEmail(row.email)) {
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
      // Catch & throw errs
      throw err;
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
          sendFinalNotification();
        }
      });
    });

    const message = listIsNew
      ? `List: ${listName} - Successfully created`
      : `List: ${listName} - Successfully updated`;
    res.status(202).send({message: message});

    return null;
  }, err => {
    throw err;
  });
};
