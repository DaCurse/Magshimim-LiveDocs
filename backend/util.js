const { BadRequest } = require('http-errors');

// Wrapper functions to forward errors from async scopes
const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

// Request param parser & validator
function parseIntParam(body, param) {
	const num = parseInt(body[param]);
	if (isNaN(num)) {
		throw BadRequest(`${param} must be a number`);
	}
	return num;
}

module.exports = {
	wrap,
	parseIntParam,
};
