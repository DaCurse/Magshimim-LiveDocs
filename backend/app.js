const express = require('express');
const path = require('path');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

// Middleware
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
const document = require('./routes/document');
app.use('/api/document', document);

// Pass 404 error after all routes
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        success: false,
        error: (app.get('env') === 'development') ? err : {}
    });
    next();
});

module.exports = app;