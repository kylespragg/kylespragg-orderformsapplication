// Configuration file for how we set up the database and where we want to locate it
// make this file through npx knex init after your server file 
module.exports = {
  development: {
    client: 'sqlite3', //using sqlite3 databases
    connection: {
      filename: './api/orderforms.db3'
    },
    migrations: { /* declare what columns are in the database and what types of data they takes (str, int const) */
      directory: './api/migrations' /*generates a folder in the api */
    },
    seeds: {
      directory: './api/seeds' /*test data to initializes the database with */
    },
    useNullAsDefault: true, /* prevents crashes */
  }
};
