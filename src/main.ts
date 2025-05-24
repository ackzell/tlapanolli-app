import { createApp } from 'vue';

import App from './App.vue';

import 'virtual:uno.css';

import './assets/main.css';
import router from './router';

const app = createApp(App);

app.use(router);

app.mount('#app');
