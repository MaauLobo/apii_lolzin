import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'

const app = createApp(App);

// Configurar o Axios para todas as solicitações
app.config.globalProperties.$axios = axios;

// Use o roteador
app.use(router);

// Monte o aplicativo no elemento '#app'
app.mount('#app');
