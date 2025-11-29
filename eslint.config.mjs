import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      'src/env.d.ts', // Astro type reference
    ],
  },

  // Base config for all files
  eslint.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Astro files
  ...astroPlugin.configs.recommended,

  // Svelte files
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: tsparser,
        svelteFeatures: {
          experimentalGenerics: true,
        },
      },
    },
    rules: {
      // Relax some rules for Svelte 5 compatibility
      'no-undef': 'off', // TypeScript handles this
      'no-unused-vars': 'off', // Handled by svelte plugin
    },
  },

  // Config files with Node.js globals
  {
    files: ['*.config.{js,mjs,ts}', '*.config.*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Disable formatting rules (handled by Prettier)
  eslintConfigPrettier,
];
