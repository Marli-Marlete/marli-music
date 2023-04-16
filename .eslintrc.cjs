module.exports = {
	parser: '@typescript-eslint/parser',
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'sort-keys-fix'],
	rules: {
		'sort-keys-fix/sort-keys-fix': 'warn',
	},
};
