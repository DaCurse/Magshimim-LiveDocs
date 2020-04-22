const models = require('../../models');

describe('Sequelize initialization', () => {
	it('Returns the document model', () => {
		expect(models.Document).toBeTruthy();
	});
});

describe('Model creation', () => {
	it('Creates a document', async () => {
		let document = await models.Document.create({
			title: 'test',
			content: 'Hello World',
		});
		expect(document.title).toBe('test');
	});
});
