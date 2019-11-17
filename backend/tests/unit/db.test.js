const models = require('../../models');

describe('Sequelize initialization', () => {
    it('returns the document model', () => {
        expect(models.Document).toBeTruthy();
    });
});