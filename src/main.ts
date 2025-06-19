import { PiniaColada } from '@pinia/colada';
import { createPinia } from 'pinia';
import 'virtual:uno.css';
import { createApp } from 'vue';

import { vSiblingFocus } from '@/directives/siblingFocus';

import App from './App.vue';
import './assets/main.css';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(router);

app.use(pinia);
app.use(PiniaColada, {
  // Optionally provide global options here for queries
  queryOptions: {
    gcTime: 300_000, // 5 minutes, the default
  },
});

app.directive('sibling-focus', vSiblingFocus);

app.mount('#app');
