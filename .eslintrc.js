module.exports = {
	env: {
		es2021: true,
		node: true,
		'jest/globals': true,
	},
	extends: ['airbnb-base'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'jest'],
	rules: {
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		// Disabled because Prettier takes care of formattiing
		indent: [0, 'tab'],
		'no-tabs': 0,
		'import/no-unresolved': 0,
		'import/extensions': 0,
		'import/no-useless-path-segments': 0,
		'arrow-body-style': 0,
		'operator-linebreak': 0,
		'no-mixed-spaces-and-tabs': 0,
		'implicit-arrow-linebreak': 0,
		'function-paren-newline': 0,
	},
};
