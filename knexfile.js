module.exports = {

  development: {  //development environment section of knex configuration
    client: 'pg',
    connection: 'postgres://localhost/palettepicker', //connect to palettepicker database
    migrations: {
      directory: './db/migrations' //define migrations folder path
    },
    seeds: {
      directory: './db/seeds/dev'  //define seed data folder path
    },
    useNullAsDefault: true
  },
    production: { //production environment section of knex configuration
      client: 'pg',
      connection: process.env.DATABASE_URL + `?ssl=true`, //connect to environment url
      migrations: {
        directory: './db/migrations' //define migrations folder path
    },
    useNullAsDefault: true
  },
  test: {  //testing environment section of knex configuration
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/palettepicker_test', //connect to palettepicker_test database
    migrations: {
      directory: './db/migrations'  //define migrations folder path
    },
    seeds: {
      directory: './db/seeds/test'  //define seeds folder path
    },
    useNullAsDefault: true
  }
};
