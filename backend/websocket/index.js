const io = require('socket.io')({
    path: '/api/live'
});
const server = {};

server.io = io;

module.exports = server;