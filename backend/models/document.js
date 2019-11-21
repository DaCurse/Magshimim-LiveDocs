const validFilename = require('valid-filename');
const createError = require('http-errors');

module.exports = (sequelize, DataTypes) => {
    class Document extends sequelize.Sequelize.Model {}
    Document.init({
        title: {
            type: DataTypes.STRING,
            validate: {
                invalidTitle(value) {
                    if (!validFilename(value)) {
                        throw new createError.BadRequest('Title is invalid');
                    }
                }
            }
        },
        content: DataTypes.TEXT
    }, { sequelize });
    return Document;
};