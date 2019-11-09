const express = require('express');
const path = require('path');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
const pages = require('./routes/pages');

app.use('/', pages);

// Pass 404 error after all routes
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({
        success: false,
        error: err.message
    });
});

module.exports = app;