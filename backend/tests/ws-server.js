/**
 * Dummy WebSocket server for tests
 */
const { port } = require('../config/test.json');
const server = require('http').createServer();
const websocket = require('../websocket');

websocket.io.attach(server);
server.listen(port);