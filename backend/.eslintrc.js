module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: '2019',
		sourceType: 'module',
	},
	env: {
		node: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	settings: {
		react: {
			pragma: 'React',
			version: 'detect',
		},
	},
	rules: {},
};
