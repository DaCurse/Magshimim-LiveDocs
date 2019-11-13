const request = require('supertest');
const app = require('../app');

describe('Index route', () => {
    it('should visit the index without error', async () => {
        const res = await request(app)
            .get('/');
        expect(res.statusCode).toBe(200);
    });
});