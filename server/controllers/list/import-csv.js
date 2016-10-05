const path = require('path');
const csv = require('csv');
const fs = require('fs');
const queue = require('async/queue');

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

module.exports = (req, res) => {
    /*
        Outstanding issues:
        TODO: TSV & other files are not accounted for. The current method only works with CSV files. There's also no current validation of CSV files in terms of both the information within and the actual file type.
        TODO: Currently, only emails are stored from the header/email labeled 'email'. Everything else is ignored. This should be changed to store other fields.
        TODO: Delete CSV after use
        TODO: Res.send needs to occur as a status 202 to confirm that the request can be processed. As this can take time, notification of the actual success of upserting all data needs to happen later.
    */

    /*
        Steps in this file
        1. Check if the list (req.body.list) exists. If so, use it. If not, create it.
        2. Iterate through the CSV file based on the concurrency set in const concurrency.
        3. Using the instance of the list table upsert rows to the listsubscriber(s) table, providing a foreign key from the list instance.
    */

    const listName = req.body.list; // Name of the list from the user
    const userPrimaryKey = req.user.id; // User's ID stored in session

    // Validate the list name. This should also be handled client side so there's no need for a message response.
    if (listName === '') {
        res.status(400).send();
        return;
    }

    const listPromise = new Promise((resolve, reject) => {
        db.list.findOrCreate({
            where: {
                name: listName,
                userId: userPrimaryKey
            }
        }).then(listInstance => {
            resolve(listInstance);
        }).catch(err => {
            throw err;
            reject();
        });
    });

    listPromise.then(listInstance => {
        listInstance = listInstance[0]; // Each list is unique, so we can always grab the first index

        const concurrency = 500; // Number of rows and upserts to handle concurrently. Arbitrary number.
        console.log(listInstance);
        const listIsNew = listInstance.$options.isNewRecord;
        const listId = listInstance.dataValues.id;

        const q = queue((task, callback) => {
            // Where task has object format { header: field } - e.g. { email: bob@bobmail.com }
            db.listsubscriber.upsert({
                email: task.email,
                listId: listId
            }).then(created => { // Where created = true if created, false if updated
                callback();
            });
        }, concurrency);


        /* Config csv parser */
        const parser = csv.parse({
            columns: true
        });
        const transformerOptions = {
            parallel: concurrency
        };
        /* ///////////////// */

        const transformer = csv.transform((row, callback) => {
            // Push the row to function ref q. Callback when q invokes its own callback.
            q.push([row], err => {
                if (err) throw err;
                callback();
            });
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
                // Do nothing with the data. Allow chunk to evaporate in write stream to prevent buffer overflow.
            })
            .on('end', () => {
                console.log('Upserts to listsubscribers complete ...');

                // This needs to moved below. Inadequate solution for large files.
                const message = listIsNew ? `List: ${listName} - Successfully created` : `List: ${listName} - Successfully updated`;
                res.status(listIsNew ? 201 : 200)
                    .send({
                        message: message
                    });
            });

        // Res.send will be moved here...



    });
}
