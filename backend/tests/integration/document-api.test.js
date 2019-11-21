const request = require('supertest');
const models = require('../../models');
const app = require('../../app');

describe('Document API Endpoint', () => {
    beforeAll(() => models.sequelize.sync());

    it('Gets all documents', done => {
        request(app)
            .get('/api/document/get/all')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('Creates a document and returns it', async () => {
        const res = await request(app)
            .post('/api/document/create')
            .send({
                title: 'Test'
            })
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body.document).toBeTruthy();
    });

    it('Updates created document', async () => {
        const res = await request(app)
            .post('/api/document/update/1')
            .send({
                content: 'Hello, World!'
            })
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body.updatedRows).toBe(1);
    });

});