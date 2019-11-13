module.exports = (sequelize, DataTypes) => {
    class Document extends sequelize.Sequelize.Model {}
    Document.init({
        title: DataTypes.STRING,
        content: DataTypes.TEXT
    }, { sequelize });
    return Document;
};