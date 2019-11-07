const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Test index route
app.get('/', (req, res) => {
    res.send({success: true, message: "Hello, World!"});
});

// Pass 404 error after all routes
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({success: false, error: err.message});
});

module.exports = app;