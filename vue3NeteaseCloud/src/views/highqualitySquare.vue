<template>
    <div class="play-square">
        <van-tabs 
            v-model="active" 
            animated 
            sticky 
            v-if="getFirstTag.length"
            @change="tabChange"
        >
            <van-tab :title="tag&&tag.name" v-for="(tag, i) of getFirstTag" :key="i" :name="i">
                <section class="item-wrap" v-if="cats[i]&&cats[i].sub.length">
                    <div class="items" @click.stop="goJump(item)" v-for="item of cats[i].sub" :key="item.id">
                        <div class="items-box">
                            <img src="../assets/cover.png" :data-src="item.coverImgUrl" alt="">
                            <span class="play-num">
                                <van-icon name="play" />
                                {{ numFormat(item.playCount) }}
                            </span>
                        </div>
                        <p class="intr">{{ item.name }}</p>
                    </div>
                    <div class="load-bottom">
                        <p class="text-center" v-show="!cats[i].loading" @click.stop="loadMore">点击加载更多</p>
                        <p class="text-center" v-show="cats[i].loading">
                            <van-loading size="16px">加载中...</van-loading>
                        </p>
                    </div>
                </section>
                <div class="no-data" v-else>
                    <van-loading type="spinner" />
                </div>
            </van-tab>
        </van-tabs>
        <router-view v-slot="{ Component }">
            <transition name="slide">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script>
import { Tab, Tabs, Icon, Loading, } from 'vant';
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { playListRequest } from '@/api/playList.js';
import { numFormat, lazyLoadImg, } from '@/tools/common.js'
import { useRouter } from 'vue-router';
export default {
    name: 'HighqualitySquare',
    components: {
        'van-tab': Tab,
        'van-tabs': Tabs,
        'van-icon': Icon,
        'van-loading': Loading
    },
    setup() {
        
        const active = ref(0); //激活tab
        const cats = ref([]); //所有标签
        const activeTag = ref(''); //激活tag
        let catObj = reactive({});
        const router = useRouter();

        async function loadAllCat() {
            let res = await playListRequest.getCatlist();
            catObj.categories = res.categories;
            catObj.sub = res.sub;
            catObj.all = res.all;
        }

        async function getQualityListsByCat(cat, limit, offset) {
            let res = await playListRequest.getQualityListByCat(cat, limit, offset);
            return res;
        }

        async function tabChange(name ,title) { //tab切换
            // console.log(title, name)
            activeTag.value = name;
            let len = cats.value[name].sub.length;
            if(len == 0) {
                let res = await playListRequest.getQualityListByCat(title, 18, len);
                setTimeout(() => {
                    cats.value[name].sub = cats.value[name].sub.concat(res);
                    nextTick(() => {
                        let wrapper = document.getElementsByClassName('van-tab__pane-wrapper')[name];
                        let imgs = wrapper.getElementsByTagName('img');
                        imgs = Array.from(imgs).slice(-18);
                        lazyLoadHandler(imgs, document.getElementsByClassName('play-square')[0]);
                    })
                }, 500);
            }
            // !tags.value[computedIdx.value].isLoad && getListByTag();
        }

        async function loadMore() { //加载更多
            let idx =  activeTag.value;
            let len = cats.value[idx].sub.length;
            cats.value[idx].loading = true;
            let res = await playListRequest.getQualityListByCat(getFirstTag.value[idx].name, 18, len);
            cats.value[idx].sub = cats.value[idx].sub.concat(res);
            cats.value[idx].loading = false;

            nextTick(() => {
                let wrapper = document.getElementsByClassName('van-tab__pane-wrapper')[idx];
                let imgs = wrapper.getElementsByTagName('img');
                imgs = Array.from(imgs).slice(-18);
                lazyLoadHandler(imgs, document.getElementsByClassName('play-square')[0]);
            })
        }

        function lazyLoadHandler(imgs, wrap) { //懒加载函数
            imgs.forEach(item => {
                lazyLoadImg(item, {
                    root: wrap,
                    threshold: 0,
                    rootMargin: '0px 0px 0px 0px'
                })
            })
        }

        const getFirstTag = computed(() => {
            let arr = [];
            catObj.categories&&Object.keys(catObj.categories).forEach(k => {
                let first = catObj.sub.find((item) => {
                    return item.category == k;
                })
                arr.push(first);
            })
            arr.unshift(catObj.all);
        
            return arr;
        })

        const convertTagsByCats = computed(() => {
            /**
             * 希望得到 [
             *      {title: xxx, sub: [a,b,c]},
             *      {title: xxx, sub: [a,b,c]},
             * ]
             */
            let arr = [];
            catObj.categories&&Object.keys(catObj.categories).forEach(k => {
                let obj = {};
                obj.title = catObj.categories[k];
                let sub = [];
                catObj.sub.map((item, i) => {
                    if(item.category == k) {
                        sub.push(item);
                        catObj.sub.splice(i, 1);
                    }
                })
                obj.sub = sub;
                arr.push(obj);
            })
            console.log(arr);
        })

        function goJump(item) { //跳转
            router.push({
                name: 'HighqualitySquarePlayList',
                params: {
                    id: item.id
                },
                query: {
                    name: item.name
                }
            })
        }

        // loadTag();
        loadAllCat();

        watch(getFirstTag, (now) => { //如果有变化说明tab已经生成可以请求第一个tab的数据
            now.map(item => {
                cats.value.push({
                    sub: [],
                    loading: false
                });
            })
            tabChange(0, now[0].name);
        })

        return {
            active,
            cats,
            tabChange,
            getFirstTag,
            loadMore,
            numFormat,
            convertTagsByCats,
            goJump
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../assets/common.scss';
</style>