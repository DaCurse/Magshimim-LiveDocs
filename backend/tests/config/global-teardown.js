/**
 * Tear down the environment that was setup for tests
 */
module.exports = () => {
    global.__DB__.sequelize.drop();
}