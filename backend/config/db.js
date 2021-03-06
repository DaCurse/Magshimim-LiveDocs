const debug = require('debug')('livedocs:db');
const path = require('path');

module.exports = {
	development: {
		username: 'root',
		password: 'root',
		database: 'livedocs_dev',
		host: 'localhost',
		dialect: 'mysql',
		logging: (msg) => {
			debug(msg);
		},
	},
	test: {
		dialect: 'sqlite',
		storage: path.join(__dirname, '../tests/mock/db.sqlite'),
		logging: false,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOSTNAME,
		dialect: 'mysql',
		use_env_variable: 'DATABASE_URL',
	},
};
