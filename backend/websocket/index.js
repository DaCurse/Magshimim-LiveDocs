const io = require('socket.io')({
	path: '/live',
});

const { Document } = require('../models');
const debug = require('debug')('livedocs:websocket');
const DiffMatchPatch = require('diff-match-patch');
const server = {};

server.io = io;

io.on('connection', async (socket) => {
	const room = 'document';
	const dmp = new DiffMatchPatch();
	const document = await Document.findOne({ where: { id: 1 } });

	// For now, join a default room
	socket.join(room);

	socket.on('make-patch', (data) => {
		const { patch } = data;
		document.content = dmp.patch_apply(patch, document.content)[0];
		document.save();
		socket.to(room).emit('apply-patch', { patch });
	});

	socket.on('disconnect', () => {
		debug(`WebSocket with ID ${socket.id} disconnected`);
	});
});

module.exports = server;
