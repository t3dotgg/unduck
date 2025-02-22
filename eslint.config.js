import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: { globals: globals.browser },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...eslintPluginPrettier.configs.recommended.rules,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
