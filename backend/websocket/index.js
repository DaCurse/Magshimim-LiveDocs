const io = require('socket.io')();
const server = {};

server.io = io;

module.exports = server;