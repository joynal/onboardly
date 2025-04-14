import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import securityPlugin from 'eslint-plugin-security';

export default tseslint.config(
    {
        ignores: ['**/build/**', '**/tmp/**', '**/coverage/**', 'node_modules/*', '**/*.mjs'],
    },
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    securityPlugin.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    eslintPluginPrettierRecommended,
    sonarjsPlugin.configs.recommended,
    {
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.js'],
        extends: [tseslint.configs.disableTypeChecked],
    },
    {
        rules: {
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/no-empty-function': [
                'error',
                {
                    allow: ['constructors', 'arrowFunctions', 'functions', 'methods'],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'none',
                    ignoreRestSiblings: true,
                },
            ],
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'no-use-before-define': 'off',
            'prefer-arrow-callback': 'warn',
            'no-underscore-dangle': [
                'warn',
                {
                    allowFunctionParams: true,
                },
            ],
            'comma-dangle': ['error', 'always-multiline'],
            'prettier/prettier': 'error',
            'sonarjs/no-duplicate-string': 'warn',
            'sonarjs/cognitive-complexity': 'warn',
        },
    },
);
