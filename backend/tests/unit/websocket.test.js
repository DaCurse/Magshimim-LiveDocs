const io = require('socket.io-client');

describe('WebSocket server tests', () => {
    it('Should connect to WebSocket server', done => {
        this.client = io(`ws://localhost:${global.__PORT__}`, {path: '/api/live'});
        this.client.on('connect', done);
    });
});