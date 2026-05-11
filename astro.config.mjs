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
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Keep the heavy 3D renderer libs out of the critical bundle.
            // splat-viewer.ts dynamic-imports them; visitors who never reach a
            // /proyectos/* page with a model never download these chunks.
            if (id.includes('node_modules/three/')) return 'three';
            if (id.includes('node_modules/@sparkjsdev/spark/')) return 'spark';
            return undefined;
          },
        },
      },
    },
    assetsInclude: ['**/*.spz'],
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
