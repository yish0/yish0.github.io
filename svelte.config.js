import { vitePreprocess } from '@astrojs/svelte';

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    // Enable runtime reactivity
    runes: true,
  },
};
