module.exports = (sequelize, DataTypes) => {
	class User extends sequelize.Sequelize.Model {}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				validate: {
					notNull: {
						msg: 'Username cannot be empty',
					},
				},
				allowNull: false,
				unique: true,
			},
			password: DataTypes.STRING,
		},
		{ sequelize },
	);
	return User;
};
