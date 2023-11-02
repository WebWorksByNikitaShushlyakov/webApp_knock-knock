import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import router from '@/router/router';

const app = createApp(App)

// Подключение роутера и Рендер приложения 
app
    .use(router)
    .use(store)
    .mount('#app')