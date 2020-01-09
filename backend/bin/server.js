#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require('../app');
const debug = require('debug')('livedocs:server');
const http = require('http');
const models = require('../models');
const websocket = require('../websocket');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || 8080);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

models.sequelize.sync().then(() => {
    /**
     * Initialize WebSocket server to listen on the HTTP Server
     */
    websocket.io.attach(server);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    /**
     * Event handlers
     */
    server.on('error', onError);
    server.on('listening', onListening);
    server.on('request', onRequest);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP requests.
 */
function onRequest(req) {
    debug(`${req.method} ${req.url}`);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}