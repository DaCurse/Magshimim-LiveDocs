const io = require('socket.io')({
	path: '/live',
});

const { Document } = require('../models');
const debug = require('debug')('livedocs:websocket');
const DiffMatchPatch = require('diff-match-patch');
const { verifyJWT } = require('../util');
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
	// eslint-disable-next-line
	let userId, username, room;

	socket.use((packet, next) => {
		const { jwt } = packet[1];
		if (!jwt) {
			socket.emit('live-error', {
				msg: 'Unauthorized. Changes will not be saved.',
			});
			return;
		}
		try {
			const token = verifyJWT(jwt);
			userId = token.data.username;
			username = token.data.userId;
		} catch (err) {
			socket.emit('live-error', 'Invalid JWT.');
		}
		next();
	});

	socket.on('join-document', (data) => {
		room = data.id;
		socket.join(room);
	});

	socket.on('make-patch', (data) => {
		const { patch } = data;
		queue.unshift({ patch, id: room });
		socket.to(room).emit('apply-patch', { patch });
	});

	socket.on('disconnect', () => {
		debug(`WebSocket with ID ${socket.id} disconnected`);
	});
});

module.exports = server;
