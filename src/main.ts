import 'virtual:uno.css';
import { createApp } from 'vue';

import App from './App.vue';
import './assets/main.css';
import oauthPlugin from './plugins/oauthPlugin';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(oauthPlugin);

app.mount('#app');
