const models = require('../../models');

describe('Sequelize initialization', () => {
    it('Returns the document model', () => {
        expect(models.Document).toBeTruthy();
    });
});

describe('Model creation', () => {
    beforeAll(() => models.sequelize.sync());

    it('Creates a document', () => {
        return models.Document.create({
            title: "test",
            content: "Hello World"
        }).then(document => {
            expect(document.title).toBe("test");
        });
    });

});