const validFilename = require('valid-filename');
const { BadRequest } = require('http-errors');

module.exports = (sequelize, DataTypes) => {
    class Document extends sequelize.Sequelize.Model {}
    Document.init({
        title: {
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: 'Title cannot be empty'
                },
                invalidTitle(value) {
                    if (!validFilename(value)) {
                        throw BadRequest('Title is invalid');
                    }
                }
            },
            allowNull: false
        },
        content: DataTypes.TEXT
    }, { sequelize });
    return Document;
};