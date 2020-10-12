<template>
    <div id="app">
        <Header />
        <SwitchPannel />
        <router-view v-slot="{ Component }">
            <keep-alive :include="keepViews">
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <PlayBar />
    </div>
</template>

<script>
    import Header from '@/components/header/header.vue'
    import SwitchPannel from '@/components/switchPannel/switchPannel.vue'
    import PlayBar from '@/components/playBar/playBar.vue'
    import { login } from '@/api/home.js';

    export default {
        name: 'App',
        components: {
            Header,
            SwitchPannel,
            PlayBar
        },
        setup() {
            const keepViews = ['Home', 'Sort', 'Singer'];
            login();
            
            return {
                keepViews
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/style.scss';
</style>
