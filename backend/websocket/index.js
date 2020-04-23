const io = require('socket.io')({
	path: '/live',
});

const { Document } = require('../models');
const debug = require('debug')('livedocs:websocket');
const DiffMatchPatch = require('diff-match-patch');
const server = {};
const dmp = new DiffMatchPatch();

server.io = io;

const queue = [];
async function applyNextPatch() {
	if (queue.length) {
		const { id, patch } = queue.pop();
		const document = await Document.findOne({ where: { id } });
		document.content = dmp.patch_apply(patch, document.content)[0];
		await document.save();
	}
	setTimeout(applyNextPatch, 10);
}
applyNextPatch();

io.on('connection', async (socket) => {
	const room = 'document';
	const id = 1;
	// For now, join a default room
	socket.join(room);

	socket.on('make-patch', (data) => {
		const { patch } = data;
		queue.unshift({ patch, id });
		socket.to(room).emit('apply-patch', { patch });
	});

	socket.on('disconnect', () => {
		debug(`WebSocket with ID ${socket.id} disconnected`);
	});
});

module.exports = server;
