<template>
    <div class="play-square">
        <van-tabs 
            v-model="active" 
            animated 
            sticky 
            v-if="tags.length"
            @change="tabChange"
        >
            <van-tab :title="tag.name" v-for="(tag) of tags" :key="tag.id" :name="tag.id">
                <section class="item-wrap" v-if="tag.sub.length">
                    <div class="items" @click.stop="goJump(item)" v-for="item of tag.sub" :key="item.id">
                        <div class="items-box">
                            <img :src="item.coverImgUrl" alt="">
                            <span class="play-num">
                                <van-icon name="play" />
                                {{ numFormat(item.playCount) }}
                            </span>
                        </div>
                        <p class="intr">{{ item.name }}</p>
                    </div>
                    <div class="load-bottom">
                        <p class="text-center" v-show="!tag.loading" @click.stop="getListByTag">点击加载更多</p>
                        <p class="text-center" v-show="tag.loading">
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
import { computed, ref } from 'vue';
import { playListRequest } from '@/api/playList.js';
import { useRouter } from 'vue-router';
import { numFormat } from '@/tools/common.js'

export default {
    name: 'PlaySquare',
    components: {
        'van-tab': Tab,
        'van-tabs': Tabs,
        'van-icon': Icon,
        'van-loading': Loading
    },
    setup() {
        const active = ref(0); //激活tab
        const tags = ref([]); //所有标签
        const activeTag = ref(''); //激活tag
        let lastTime = '';
        const router = useRouter();

        const computedIdx = computed(() => {
            for(let i = 0; i < tags.value.length; i ++) {
                if(tags.value[i].id == activeTag.value) {
                    return i;
                }
            }
        })

        async function loadTag() {
            let res = await playListRequest.getTags();
            tags.value = res;
            tags.value.map((item) => {
                item.sub = []; //每个标签下的具体列表
                item.isLoad = false; //每个标签下的初始状态为未加载过
                item.loading = false;
            })
            activeTag.value = tags.value[0].id;
            getListByTag();
        }

        async function getListByTag() {
            let lasttime = lastTime || '';
            tags.value[computedIdx.value].loading = true;
            let res = await playListRequest.getListByTag(activeTag.value, 18, lasttime);
            setTimeout(() => {
                tags.value[computedIdx.value].loading = false;
                lastTime = res.lasttime;
                tags.value[computedIdx.value].sub = tags.value[computedIdx.value].sub.concat(res.playlists);
                tags.value[computedIdx.value].isLoad = true;
            }, 500)
        }

        function tabChange(name ,title) { //tab切换
            activeTag.value = name;
            !tags.value[computedIdx.value].isLoad && getListByTag();
        }

        function goJump(item) { //跳转
            router.push({
                name: 'PlaySquarePlayList',
                params: {
                    id: item.id
                },
                query: {
                    name: item.name
                }
            })
        }

        loadTag();

        return {
            active,
            tags,
            tabChange,
            getListByTag,
            goJump,
            numFormat,
        }
    }
}
</script>

<style scoped lang="scss">
    @import '../assets/common.scss';
</style>