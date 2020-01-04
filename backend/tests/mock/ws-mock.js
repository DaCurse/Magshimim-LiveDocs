/**
 * WebSocket server mock for tests
 */
const server = require('http').createServer();
const websocket = require('../../websocket');

websocket.io.attach(server);
server.listen(process.env.PORT || 8081);

module.exports = server;