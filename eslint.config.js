import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  { ignores: ['node_modules/**', 'public/**', 'vendor/**', 'bootstrap/ssr/**', 'docs/**', 'storage/**'] },
  js.configs.recommended,
  {
    files: ['resources/js/**/*.{js,jsx,ts,tsx}', 'vite.config.ts'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        route: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // TypeScript already checks undefined identifiers.
      'no-undef': 'off',
      // Admin/debug logging is intentional in several forms.
      'no-console': 'off',
      // Prefer the TS-aware rule; allow intentional _prefixed unused bindings.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            // Inertia <Head> uniqueness keys
            'head-key',
            // cmdk / shadcn command input wrapper marker
            'cmdk-input-wrapper',
          ],
        },
      ],
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },
];
