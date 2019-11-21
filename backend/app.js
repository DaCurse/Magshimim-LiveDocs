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
    next(createError.NotFound());
});

// Error handler
app.use((err, req, res, next) => {
    // Account for sequelize-wrapped errors
    res.status(
        (err.errors[0].original.status) ?
            err.errors[0].original.status :
            err.status || 500
    );
    res.send({
        success: false,
        error: (app.get('env') === 'development') ? err : {}
    });
    next();
});

module.exports = app;