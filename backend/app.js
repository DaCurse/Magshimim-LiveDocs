const express = require('express');
const path = require('path');
const { NotFound } = require('http-errors');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

// Middleware
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/api/document', require('./routes/document'));
app.use('/api/user', require('./routes/user'));

// Pass 404 error after all routes
app.use((req, res, next) => next(NotFound()));

// Error handler
app.use((err, req, res, next) => {
	res.status(
		// Account for sequelize-wrapped errors
		!err.errors
			? err.status || 500
			: err.errors[0].original
			? err.errors[0].original.status
			: 400,
	);
	res.send({
		success: false,
		error:
			app.get('env') !== 'development'
				? {}
				: err.errors
				? err.errors[0].message
				: err.message || err,
	});
	next();
});

module.exports = app;
