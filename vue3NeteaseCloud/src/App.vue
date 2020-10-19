<template>
    <div id="app">
        <Header />
        <SwitchPannel />
        <router-view v-slot="{ Component }">
            <keep-alive :include="getKeep">
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
    import { useStore } from 'vuex';
    import { computed, watch } from 'vue';

    export default {
        name: 'App',
        components: {
            Header,
            SwitchPannel,
            PlayBar
        },
        setup() {
            const store = useStore();
            const keepViews = ['Home', 'Sort', ];
            login();
            let kp = computed(() => store.getters.getKeep);
            watch(kp, (now) => {
                console.log(now);
            })
            
            return {
                keepViews,
                getKeep: computed(() => store.getters.getKeep)
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/style.scss';
</style>
