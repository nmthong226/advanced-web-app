import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: '@typescript-eslint/parser',  // For TypeScript
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Add additional rule customizations here...
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
  },
  pluginReact.configs.recommended,
  pluginReact.configs['jsx-runtime'],  // For React 17 JSX Transform
];
