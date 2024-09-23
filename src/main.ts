import '@csstools/normalize.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import '@icon-park/vue-next/styles/index.css';
console.log(import.meta.env.MODE, '模式');
// console.log(import.meta.env.VITE_BASE_API,'url')
createApp(App).use(createPinia()).use(router).mount('#app');
