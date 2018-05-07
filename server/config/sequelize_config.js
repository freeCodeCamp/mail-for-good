module.exports = {
  "development": {
    "username": process.env.PSQL_USERNAME,
    "password": process.env.PSQL_PASSWORD,
    "database": process.env.PSQL_DATABASE,
    "host": process.env.PSQL_HOST || "127.0.0.1",
    "dialect": "postgres",
    "logging": false,
    "url": process.env.DATABASE_URL,
  },
  "test": {
    "username": "postgres",  // hacky fix for test envs
    "password": "",
    "database": "test",
    "host": process.env.PSQL_HOST || "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.PSQL_USERNAME,
    "password": process.env.PSQL_PASSWORD,
    "database": process.env.PSQL_DATABASE,
    "host": process.env.PSQL_HOST || "127.0.0.1",
    "dialect": "postgres",
    "logging": false,
    "url": process.env.DATABASE_URL, 
    "ssl": process.env.HEROKU ? true : false,
    "dialectOptions": process.env.HEROKU ? {"ssl":true} : {}
  }
};
