<template>
    <div class="box-wrap">
        <Banners />
        <main>
            <section class="mod">
                <mod-title title="官方推荐" :item="{name: 'PlaySquare'}" />
                <mod-section :list="recommendList" :func="goPlayList" />
                <mod-title title="精选歌单" :item="{name: 'HighqualitySquare'}" />
                <mod-section :list="topPlayList" :func="goPlayList" />
                <mod-title title="最新MV" :item="{name: 'MvIndex'}" />
                <mod-mv :list="newMvList" />
            </section>
        </main>
        <Footer />
        <router-view v-slot="{ Component }">
            <transition name="slide">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script>
    import Banners from '@/components/banners/banners.vue';
    import ModTitle from '@/components/home/modTitle.vue';
    import ModSection from '@/components/home/modSection.vue';
    import ModMv from '@/components/home/modMv.vue';
    import Footer from '@/components/footer/footer';
    import { loading, loaded } from '@/tools/common.js';
    import { Icon, Toast } from 'vant';
    import { getRecommend, getTopPlay, getNewMv } from '@/api/home.js';
    import { ref, 
             reactive ,
             computed,
             onActivated,
             onMounted,
             nextTick
            } from 'vue';

    import { onBeforeRouteLeave, useRouter, } from 'vue-router';
    export default {
        name: "Home",
        components: {
            Banners,
            'mod-title': ModTitle,
            'mod-section': ModSection,
            'mod-mv': ModMv,
            'van-icon': Icon,
            Footer
        },
        setup() {
            const recommendList = ref([]);
            const topPlayList = ref([]);
            const newMvList = ref([]);
            let top = 0;
            const router = useRouter();

            onActivated(() => {
                document.getElementsByClassName('box-wrap')[0].scrollTo(0, top);
            })

            onBeforeRouteLeave((to, from, next) => {
                top = document.getElementsByClassName('box-wrap')[0].scrollTop;
                next();
            })

            async function getRecommends() {
                let res = await getRecommend();
                recommendList.value = res;
                return Promise.resolve();
            }

            async function getTopPlayList() {
                let res = await getTopPlay();
                topPlayList.value = res;
                return Promise.resolve();
            }

            async function getNewMvList() {
                let res = await getNewMv();
                newMvList.value = res;
                return Promise.resolve();
            }

            function formatWan(num) {
                return (num / 10000).toFixed(1) + '万'
            }

            function loadData() {
                loading();
                Promise.all([getRecommends(), getTopPlayList(), getNewMvList()]).then(res=>{
                    setTimeout(() => {
                        loaded();
                    }, 1000)
                })
            }

            function goPlayList(item) {
                // console.log(item); 
                router.push({
                    name: 'PlayList',
                    params: {id: item.id},
                    query: {name: item.name}
                })
            }

            loadData();

            return {
                recommendList,
                topPlayList,
                newMvList,
                formatWan,
                goPlayList,
            }
        }
    };
</script>

<style lang="scss" scoped>
    // @import '@/assets/style.scss';
</style>