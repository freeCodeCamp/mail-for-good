const httpMocks = require('node-mocks-http');
const test = require('tape');
const sinon = require('sinon');
const path = require('path');
const exec = require('child_process').exec;

const importCsv = require('../../../controllers/list/import-csv');

// Constants defining key db fields
const USER_ID = 1;
const LIST_NAME = 'list';

const {
  sequelize,
  campaignsubscriber: CampaignSubscriber,
  campaign: Campaign,
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
  t.plan(1);
  const FILENAME = '10normalemails';
  const PATH_TO_FILE = path.resolve(__dirname, `./test-csv-files/${FILENAME}`);

  // Write CSV files to ./test-csv-files/10normalemails
  exec(`rm ${PATH_TO_FILE}; echo "email\na@a.com\nb@b.com\nc@c.com" > ${PATH_TO_FILE};`);

  // Clear db & prep for import
  await prepareDbForCsvImports();

  // Mock req, res and io
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
      reload: sinon.stub()
    }
  });
  const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
  const io = {};

  importCsv(req, res, io);

  res.on('end', () => {
    t.equal(202, res.statusCode, 'Response status code equals 202');
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
