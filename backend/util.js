const { BadRequest } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;
const JWT_SECRET = 'verysecret';
const JWT_EXP = 60 * 60 * 2; // 2 Hours

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

function hashPassword(password) {
	return bcrypt.hash(password, SALT_ROUNDS);
}

function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

function createJWT(data) {
	return jwt.sign(
		{ exp: Math.floor(Date.now() / 1000) + JWT_EXP, data },
		JWT_SECRET,
	);
}

function verifyJWT(token) {
	return jwt.verify(token, JWT_SECRET);
}

module.exports = {
	wrap,
	parseIntParam,
	hashPassword,
	verifyPassword,
	createJWT,
	verifyJWT,
};
