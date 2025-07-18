import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    VueRouter({
      /* options */
      exclude: ['**/components/*', '**/composables/*', '**/loaders/*'],
    }),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 8888,
    https: {
      key: 'certs/127.0.0.1-key.pem',
      cert: 'certs/127.0.0.1.pem',
    },

  },
});
