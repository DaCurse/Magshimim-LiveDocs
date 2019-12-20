const { port } = require('../../config/test.json');
const io = require('socket.io-client');

describe('WebSocket server tests', () => {
    beforeAll(() => require('../ws-server'));

    it('Should connect to WebSocket server', done => {
        this.client = io(`ws://localhost:${port}`);
        this.client.on('connect', done);
    });
});