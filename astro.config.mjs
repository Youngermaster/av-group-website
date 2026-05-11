// @ts-check
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://pentoluxury.com',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    assets: '_pento',
  },
  vite: {
    build: {
      cssCodeSplit: true,
      target: 'es2022',
    },
  },
  integrations: [
    compress({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: false,
    }),
  ],
});
