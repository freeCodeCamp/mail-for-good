const path = require('path');
const csv = require('csv');
const fs = require('fs');
const cargo = require('async/cargo');

const db = require('../../models');

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
        TODO: Currently, only emails are stored from the header/email labeled 'email'. Everything else is ignored. This should be changed to store other fields.
    */

  /*
        Steps in this file
        1. Check if the list (req.body.list) exists. If so, use it. If not, create it.
        2. Iterate through the CSV file based on the concurrency set in const concurrency.
        3. Using the instance of the list table upsert rows to the listsubscriber(s) table, providing a foreign key from the list instance.
    */

  const listName = req.body.list; // Name of the list from the user
  const userPrimaryKey = req.user.id; // User's ID stored in session

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
      userId: userPrimaryKey
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
    const concurrency = 1000; // Number of rows and upserts to handle concurrently. Arbitrary number.
    let numberProcessed = 0, targetProcessed = 1000; // Vars for tracking how many CSVs have been processed. Sends a WS notification per 1k processed emails.
    const crudeRandomId = (Math.random() * 100000).toString(); // This doesn't really need to be unique as only one CSV should ever be uploaded at any one time by a client

    listInstance = listInstance[0];
    const listIsNew = listInstance.$options.isNewRecord;
    const listId = listInstance.dataValues.id;

    let bufferArray = [];
    const bufferLength = 1000;

    const c = cargo((tasks, callback) => {

      db.listsubscriber.bulkCreate(tasks, { logging: true })
        .then(() => {


          const rowsParsed = {
            message: `Processed ${numberProcessed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} rows...`,
            isUpdate: true, // Mark this notification as an update for an existing notification to the client
            id: crudeRandomId, // Unique identified for use on client side (in the reducer)
            icon: 'fa-upload',
            iconColour: 'text-blue'
          };
          if (io.sockets.connected[req.session.passport.socket]) {
            io.sockets.connected[req.session.passport.socket].emit('notification', rowsParsed);
          }

          numberProcessed = targetProcessed;
          targetProcessed += 1000;

          callback();
        })
        .catch(() => {
          console.log('Oh dear');
        });

    }, concurrency);

    /* Config csv parser */
    const parser = csv.parse({ columns: true, skip_empty_lines: true }); // Write object with headers as object keys, and skip empty rows
    const transformerOptions = {
      parallel: concurrency
    };
    /* ///////////////// */

    const transformer = csv.transform((row, callback) => {
      // If row has no email field (though it should), skip the line. Implicit conversion from both undefined & '' is assumed.
      if (!row.email || !validateEmail(row.email)) {
        callback();
      } else {
        // Add fields to row
        row['listId'] = listId;

        bufferArray.push(row);

        if (bufferArray.length >= bufferLength) {
          c.push(bufferArray, err => {
            if (err)
              throw err;
          });
          bufferArray = [];
        }
        callback();

      }
    }, transformerOptions);

    transformer.on('error', err => {
      // Catch & throw errs
      throw err;
    });

    // Create read stream, parse then pipe to transformer to perform async operations. Finally, release data for garbage collection.
    fs.createReadStream(`${path.resolve(req.file.path)}`)
      .pipe(parser)
      .pipe(transformer)
      .on('data', () => {
      // Do nothing with the data. Let it be garbage collected.
    }).on('end', () => {
      // Delete CSV
      const filename = req.file.originalname;
      fs.unlink(`${path.resolve(req.file.path)}`, err => {
        // IDEA: Post success to a field in the user model called 'notifications' & push through websocket
        if (err) throw err;
        const importSuccess = {
          message: `Your file ${filename} has finished uploading`,
          icon: 'fa-list-alt',
          iconColour: 'text-green'
        };
        if (io.sockets.connected[req.session.passport.socket]) {
          io.sockets.connected[req.session.passport.socket].emit('notification', importSuccess);
        }
      });
    });

    const message = listIsNew
      ? `List: ${listName} - Successfully created`
      : `List: ${listName} - Successfully updated`;
    res.status(202).send({message: message});

  }, err => {
    throw err;
  });
};
