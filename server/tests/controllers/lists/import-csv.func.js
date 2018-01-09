const httpMocks = require('node-mocks-http');
const test = require('tape');
const path = require('path');
const exec = require('child_process').exec;

const importCsv = require('../../../controllers/list/import-csv');

// Constants defining key db fields
const USER_ID = 1;
const LIST_NAME = 'list';

const {
  sequelize,
  user: User,
  list: List,
  listsubscriber: ListSubscriber
} = require('../../../models');

// Make the directory test-csv-files should it not exist

exec(`mkdir ${__dirname + '/test-csv-files'}`);

/**
* Main tests
*/

test('Import CSV function correctly parses a CSV with a single column "email" & valid email rows.', async function (t) {
  t.plan(3);
  const FILENAME = '10normalemails';
  const PATH_TO_FILE = path.resolve(__dirname, `./test-csv-files/${FILENAME}`);
  const TEST_EMAIL_ARRAY = ['a@a.com', 'b@b.com', 'c@c.com'];

  // Write CSV files to ./test-csv-files/10normalemails
  exec(`rm ${PATH_TO_FILE}; echo "email\n${TEST_EMAIL_ARRAY.join('\n')}" > ${PATH_TO_FILE};`);

  // Clear db & prep for import
  await prepareDbForCsvImports();

  // Mock req, res and io
  /*
    The terminating condition of the import-csv function is when send-single-notification is called.
    This function sends the user a notification via websockets.
    It is a function that first refreshes the request it is passed to ensure that the socket info it has is correct.
    We will spy on this function and once called check the DB to validate if import-csv functioned correctly.
  */
  const stubSessionReload = func => func();
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/user/42',
    body: {
      list: LIST_NAME,
      headers: JSON.stringify(['email'])
    },
    file: {
      encoding: '7bit',
      mimetype: 'text/csv',
      filename: FILENAME,
      originalname: FILENAME,
      path: PATH_TO_FILE,
    },
    user: {
      id: USER_ID,
    },
    session: {
      reload: stubSessionReload,
      passport: {
        socket: 0,
      },
    }
  });
  const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
  const io = {
    sockets: {
      connected: {
        0: {
          emit: (type, notifcation) => {
            if (notifcation.message.startsWith('CSV validated')) {
              t.pass('Finished by calling send-single-notification');
              ListSubscriber.findAll({
                raw: true,
              }).then(values => {
                // Check if all emails were written to the db correctly.
                const everyListsubscriberWasWritten = values.every(value => ~TEST_EMAIL_ARRAY.indexOf(value.email));
                t.ok(everyListsubscriberWasWritten, 'Every item written to the db was in the uploaded file');
              });
            }
          }
        }
      }
    }
  };

  importCsv(req, res, io);

  res.on('end', () => {
    t.equal(202, res.statusCode, 'Response status code equals 202');
  });
});

test('Import CSV does not accept malformed CSVs with extra semicolons.', async function (t) {
  t.plan(1);
  const FILENAME = '10emailswithtoomanycommas';
  const PATH_TO_FILE = path.resolve(__dirname, `./test-csv-files/${FILENAME}`);
  const TEST_EMAIL_ARRAY = ['a@a.com,,,', 'b@b.com,', 'c@c.com'];

  // Write CSV files to ./test-csv-files/10normalemails
  exec(`rm ${PATH_TO_FILE}; echo "email\n${TEST_EMAIL_ARRAY.join('\n')}" > ${PATH_TO_FILE};`);

  // Clear db & prep for import
  await prepareDbForCsvImports();

  // Mock req, res and io
  /*
    The terminating condition of the import-csv function is when send-single-notification is called.
    This function sends the user a notification via websockets.
    It is a function that first refreshes the request it is passed to ensure that the socket info it has is correct.
    We will spy on this function and once called check the DB to validate if import-csv functioned correctly.
  */
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/user/42',
    body: {
      list: LIST_NAME,
      headers: JSON.stringify(['email'])
    },
    file: {
      encoding: '7bit',
      mimetype: 'text/csv',
      filename: FILENAME,
      originalname: FILENAME,
      path: PATH_TO_FILE,
    },
    user: {
      id: USER_ID,
    },
  });
  const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
  const io = {};

  importCsv(req, res, io);

  res.on('end', () => {
    t.equal(400, res.statusCode, 'Response status code equals 400');
  });
});

/**
* Helper functions
*/

const prepareDbForCsvImports = async () => {
  await sequelize.sync({ force: true });
  await User.create({
    id: USER_ID,
  });
  await List.create({
    userId: USER_ID,
    listName: LIST_NAME,
  });
  return null;
};
