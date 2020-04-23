/**
 * Setup global environment for all tests
 */
module.exports = async () => {
	global.__DB__ = require('../../models');
	global.__WS__ = require('../mock/ws-mock');
	await global.__DB__.sequelize.sync();
};
