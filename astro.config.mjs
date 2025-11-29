import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://yish0.github.io',
  integrations: [svelte(), tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['javascript', 'typescript', 'jsx', 'tsx', 'python', 'java',
              'go', 'rust', 'sql', 'bash', 'yaml', 'json']
    }
  },
  vite: {
    resolve: {
      alias: {
        '$lib': '/src/lib'
      }
    }
  }
});