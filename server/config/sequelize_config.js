const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const root = path.normalize(`${__dirname}/../..`);
const envFile = path.join(root, '.env');
let config = {};

let env = {};
if (fs.existsSync(envFile)) {
    env = dotenv.config({ path: envFile });
    process.env.DEBUG = env.parsed.DEBUG;
    config = env.parsed || env;
}

process.env.NODE_ENV = config.NODE_ENV || process.env.NODE_ENV || 'production';

const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE, DATABASE_URL } = config;
console.log( { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE })
const settings = {
    database: MYSQL_DATABASE || 'test',
    username: MYSQL_USERNAME || 'root',
    password: MYSQL_PASSWORD || '',
    dialect: 'mysql',
    host: MYSQL_HOST || '127.0.0.1',
    port: 3306,
    logging: env.NODE_ENV !== 'production',
    seederStorage: 'sequelize',
    url: DATABASE_URL,
};

module.exports = {
    development: settings,
    test: settings,
    production: {
      ...settings,
      ssl: process.env.HEROKU ? true : false,
      dialectOptions: process.env.HEROKU ? { ssl: true } : {},
    },
};
