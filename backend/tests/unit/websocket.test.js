const io = require('socket.io-client');

describe('WebSocket server tests', () => {
    beforeAll(() => {
        this.server = require('../ws-server');
        this.port = this.server.address().port;
    });

    it('Should connect to WebSocket server', done => {
        this.client = io(`ws://localhost:${this.port}`, {path: '/api/live'});
        this.client.on('connect', done);
    });
});