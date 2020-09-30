import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'

import '@/untils/rem.js'
// import Vant from 'vant';
// import 'vant/lib/index.css';
import fastClick from 'fastclick';
fastClick.attach(document.body);

router.afterEach((to, from) => {
    document.title = to.meta.title;
})

createApp(App).use(router).use(store).mount('#app')


