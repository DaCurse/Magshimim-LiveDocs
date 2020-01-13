const io = require('socket.io')({
    path: '/live'
});
const { Document } = require('../models');
const debug = require('debug')('livedocs:websocket');
const server = {};

server.io = io;

io.on('connection', socket => {
    let room = 'document';

    // For now, join a default room
    socket.join(room);

    socket.on('update-document', data => {
        debug(data);
        let { change, type, position, document } = data;

        Document.update({
            content: document.content
        }, {where: {id: document.id}});

        socket.to(room).emit('document-updated', { change, type, position });
    });

    socket.on('disconnect', () => {
        debug(`WebSocket with ID ${socket.id} disconnected`);
    });
});

module.exports = server;