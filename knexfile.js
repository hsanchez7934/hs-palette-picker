// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL + `?ssl=true`,
      migrations: {
        directory: './db/migrations'
    },
    useNullAsDefault: true
    }
  }
};