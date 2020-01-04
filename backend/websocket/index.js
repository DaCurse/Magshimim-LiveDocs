const io = require('socket.io')({
    path: '/api/live'
});
const debug = require('debug')('livedocs:websocket');
const models = require('../models');
const server = {};

server.io = io;

io.on('connection', socket => {
    socket.on('edit-document', async data => {
        let { title, content, id } = data;
        let rows = await models.Document.update({title, content}, {where: {id}});
        socket.emit('document-edited', {
            success: true,
            updatedRows: rows[0]
        });
    });

    io.on('disconnect', socket => {
        debug(`WebSocket disconnect: ID ${socket.id}`);
    });
});

module.exports = server;