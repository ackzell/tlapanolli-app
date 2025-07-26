import VueKeyboardTrapDirectivePlugin from '@pdanpdan/vue-keyboard-trap';

import { PiniaColada } from '@pinia/colada';
import { createPinia } from 'pinia';

import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';

import { createApp } from 'vue';

import { vSiblingFocus } from '@/directives/siblingFocus';
import App from './App.vue';
import router from './router';
import 'virtual:uno.css';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(DataLoaderPlugin, { router });
app.use(router);

app.use(pinia);
app.use(PiniaColada, {
  // Optionally provide global options here for queries
  queryOptions: {
    gcTime: 300_000, // 5 minutes, the default
  },
});

app.directive('sibling-focus', vSiblingFocus);

app.use(VueKeyboardTrapDirectivePlugin, {});

app.mount('#app');
