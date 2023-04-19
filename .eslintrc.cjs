module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	ignorePatterns: ['/dist/**/*.js'],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'sort-keys-fix'],
	root: true,
	rules: {
		'sort-keys-fix/sort-keys-fix': 'warn',
	},
};
