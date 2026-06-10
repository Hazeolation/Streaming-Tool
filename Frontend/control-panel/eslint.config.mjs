// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        files: [
            "**/*.ts"
        ]
    },
    {
        ignores: [
            "./node_modules/",
            "./.vscode/",
            "./.angular/"
        ]
    },
    {
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended
        ],
        rules: {
            "eqeqeq": "error"
        }
    },
]);