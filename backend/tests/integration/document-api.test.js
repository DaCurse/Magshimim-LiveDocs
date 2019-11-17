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

    it('Creates a document', async () => {
        const res = await request(app)
            .post('/api/document/create')
            .send({
                title: 'Test'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.title).toBe('Test');
    });

});