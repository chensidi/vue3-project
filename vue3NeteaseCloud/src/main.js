import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'

import '@/tools/rem.js'
// import Vant from 'vant';
// import 'vant/lib/index.css';
import fastClick from 'fastclick';
fastClick.attach(document.body);

import VConsole from 'vconsole';
if(process.env.NODE_ENV !== 'production') {
    new VConsole();
}

router.afterEach((to, from) => {
    document.title = to.meta.title;
    store.dispatch('setNumber', Math.random());
})

createApp(App).use(router).use(store).mount('#app')


