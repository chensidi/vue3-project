<template>
    <div id="app">
        <Header />
        <SwitchPannel />
        <router-view v-slot="{ Component }">
            <keep-alive :include="keepViews">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script>
    import Header from '@/components/header/header.vue'
    import SwitchPannel from '@/components/switchPannel/switchPannel.vue'
    import { onBeforeRouteUpdate } from 'vue-router'

    export default {
        name: 'App',
        components: {
            Header,
            SwitchPannel
        },
        setup() {
            const keepViews = ['Home', 'Sort'];

            onBeforeRouteUpdate((to, from, next) => {
                console.log(666)
            })

            return {
                keepViews
            }
        }
    }
</script>

<style lang="scss">
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        list-style-type: none;
    }
    #app{
        background-color: #fafafa;
        min-height: 100vh;
    }
    .box-wrap{
        position: absolute;
        top: 4.7rem;
        bottom: 0;
        width: 100vw;
        left: 0;
        overflow: auto;
    }
</style>
