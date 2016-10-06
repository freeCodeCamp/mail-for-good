module.exports = {
  "development": {
    "username": process.env.PSQL_USERNAME,
    "password": process.env.PSQL_PASSWORD,
    "database": process.env.PSQL_DATABASE,
    "host": process.env.PSQL_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
