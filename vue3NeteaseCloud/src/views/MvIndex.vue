<template>
    <div class="independent-page">
        <van-skeleton title :row="18" :loading="loading">
            <section class="mv-group">
                <mv-title 
                    :info="{
                        main: 'MV精选',
                        other: '更多'
                    }"
                    :func="goMoreMv"
                />
                <mv-block
                    v-for="item of recommendMv"
                    :key="item.id"
                    :mvInfo="item" 
                    :func="goplay"
                />
            </section>

            <section class="mv-group">
                <mv-title 
                    :info="{
                        main: '更多精彩MV',
                        other: '分类'
                    }"
                    :func="goMoreMv"
                />
                
                <one-mv
                    v-for="item of mvs"
                    :key="item.id"
                    :mvInfo="item"
                    @click.native="goplay(item)"
                />
            </section>
        </van-skeleton>
        <video-component 
            v-model="showMVPlay.show" 
            :videoInfo="{
                src: showMVPlay.url,
                poster: showMVPlay.cover,
                qualitys: showMVPlay.brs,
                id: showMVPlay.id
            }"
        />
    </div>
</template>

<script>
import BetterScroll from 'better-scroll';
import { computed, nextTick, onMounted, reactive, ref, toRefs, watch, toRef } from 'vue';
import mvRequest from '@/api/mv.js';
import { getMVUrl, getMVDetails } from '@/api/singer'
import MvBlock from '@/components/mv/MvBlock.vue';
import MvTitle from '@/components/mv/MvTitle.vue';
import OneMv from '@/components/mv/OneMv.vue';
import { Skeleton } from 'vant';
import VideoComponent from '@/components/video/VideoComponent.vue';
import { loading as loadings, loaded } from '@/tools/common.js'
export default {
    name: 'MvIndex',
    components: {
        'mv-block': MvBlock,
        'mv-title': MvTitle,
        'one-mv': OneMv,
        'van-skeleton': Skeleton,
        'video-component': VideoComponent
    },
    setup() {
        let bs = null;
        
        const testArr = ref([...new Array(100).keys()]);
        const len = computed(() => testArr.value.length);
        const obj = reactive({
            testArr: [...new Array(100).keys()]
        })

        const mvs = ref([]);
        const recommendMv = ref([]);
        const loading = ref(true);

        const showMVPlay = reactive({
            show: false,
            url: '',
            cover: ''
        })
        let showMvRef = toRef(showMVPlay, 'show');

        onMounted(() => {
            // nextTick(() => {
            //     bs = new BetterScroll('.independent-page', {
            //         movable: true,
            //         zoom: true
            //     })
            //     bs.on('touchEnd', (pos) => {
            //         // console.log(pos);
            //         console.log(bs.y, bs.maxScrollY)
            //         if(bs.y <= (bs.maxScrollY + 200)) {
            //             console.log('over')
            //             setTimeout(() => {
            //                 // testArr.value.push(...new Array(20).keys());
            //                 obj.testArr.push(...new Array(20).keys())
            //             }, 1000)
            //         }
            //     })
            // })
        })

        function loadMv() { //加载全部mv前四个
            return mvRequest.getAllMv().then(res => {
                console.log(res);
                mvs.value = res;
            })
        }

        function loadRecommendMv() { //获取推荐mv前四个
            return new Promise((resolve) => {
                mvRequest.getRecommendMv().then(res => {
                    recommendMv.value = res.slice(0, 4);
                    resolve();
                })
            })
            
        }

        function loadNewMv() {
            return new Promise((resolve) => {
                mvRequest.getNewMv().then(res => {
                    mvs.value = res;
                    resolve();
                })
            })
            
        }

        // loadMv();
        // loadRecommendMv();
        // loadNewMv();

        Promise.all([loadRecommendMv(), loadNewMv()]).then(res => {
           setTimeout(() => {
               loading.value = false;
           }, 1500)
        })

        // watch(obj, (now) => {
        //     nextTick(() => {
        //         setTimeout(() => {
        //             bs.refresh();
        //         }, 0)
        //     })
        // })

        function goMoreMv(item) { //前往更多MV
            console.log(item)
        }

        function clickFun(item) {
            console.log(item);
        }

        // function goplay(item) {
        //     console.log(item)
        // }

        async function goplay(item) {
            // console.log(item);
            loadings();
            let url = await getMVUrl(item.id);
            await gotMVDetails(item.id);
            showMVPlay.url = url;
            showMVPlay.cover = item.imgurl;
            setTimeout(() => {
                loaded();
                showMVPlay.show = true;
            }, 500)
        }

        async function gotMVDetails(id) {
            let res = await getMVDetails(id);
            let brs = res.brs;
            let brArr = [];
            brs.map(item=>{
                brArr.push(item.br);
            })
            brArr.sort((a,b) => {
                return b - a;
            })
            showMVPlay.brs = brArr;
            showMVPlay.id = res.id;
        }

        watch(showMvRef, (now) => { //解决playbar 与 video 层级冲突的问题
            if(now) {
                document.querySelector('.independent-page').style.zIndex = 999;
            }else {
                document.querySelector('.independent-page').style = '';
            }
        })

        return {
            // testArr,
            // ...toRefs(obj)
            recommendMv,
            mvs,
            clickFun,
            goMoreMv,
            loading,
            goplay,
            showMVPlay
        }
    }
}
</script>

<style lang="scss" scoped>
    .independent-page{
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        background: #fff;
    }
    .mv-group{
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    
</style>