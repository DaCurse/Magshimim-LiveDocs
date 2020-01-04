const io = require('socket.io-client');
const models = require('../../models');
const debug = require('debug')('livedocs:test');

describe('WebSocket functionality tests', () => {
    beforeAll(async done => {
        this.client = io(`ws://localhost:${global.__PORT__}`, {path: '/api/live'});
        this.client.on('connect', done);
    });
    
    it('Should update a document using WebSockets', done => {
        this.client.emit('edit-document', {title: 'title', content: 'contnet', id: 1});
        this.client.on('document-edited', data => {
            debug(data);
            expect(data.success).toBe(true);
            done();
        });
    });
});