/** @type {import("prettier").Config} */
export default {
  // Basic options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Plugin-specific options
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-astro',
    'prettier-plugin-svelte', // Must be last due to Prettier 3.7.0 compatibility
  ],

  // Astro
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],

  // Tailwind CSS class sorting
  tailwindConfig: './tailwind.config.mjs',
};
