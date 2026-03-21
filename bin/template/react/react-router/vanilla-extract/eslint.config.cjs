const tsPlugin = require('@typescript-eslint/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxA11y = require('eslint-plugin-jsx-a11y')

module.exports = [
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', 'public/**'],
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        // Using explicit rules instead of `extends` for flat config compatibility
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                },
            ],

            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',

            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
]
