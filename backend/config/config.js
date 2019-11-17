const debug = require('debug')('livedocs:db');

module.exports = {
    development: {
        username: 'root',
        password: 'root',
        database: 'livedocs_dev',
        host: 'localhost',
        dialect: 'mysql',
        logging: (msg) => {
            debug(msg);
        }
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql',
        use_env_variable: 'DATABASE_URL'
    }
};