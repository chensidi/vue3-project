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
                    <div class="items" v-for="item of tag.sub" :key="item.id">
                        <div class="items-box">
                            <img :src="item.coverImgUrl" alt="">
                            <span class="play-num">
                                <van-icon name="play" />
                                54万
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
    </div>
</template>

<script>
import { Tab, Tabs, Icon, Loading, } from 'vant';
import { computed, ref } from 'vue';
import { playListRequest } from '@/api/playList.js';
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

        loadTag();

        return {
            active,
            tags,
            tabChange,
            getListByTag,
        }
    }
}
</script>

<style scoped lang="scss">
    .play-square{
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: auto;
        background: #fff;
        padding-bottom: 50px;
    }
    .item-wrap{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 12px;
        margin: 0 -6px;
        .items{
            width: 33.333%;
            position: relative;
            padding: 6px;
            .items-box{
                width: 100%;
                height: 0;
                padding-bottom: 100%;
                position: relative;
                >img{
                    width: 100%;
                    height: 100%;
                    display: block;
                    position: absolute;
                    left: 9;
                    top: 0;
                    border-radius: 2px;
                }
            }
            
            .intr{
                display: -webkit-box;    
                -webkit-box-orient: vertical;    
                -webkit-line-clamp: 2;    
                overflow: hidden;
                font-size: 12px;
                color: #333;
                margin-top: 5px;
            }
        }
        .play-num{
            position: absolute;
            top: 5px;
            right: 5px;
            color: #fff;
            font-size: 12px;
        }
    }
    .no-data{
        padding: 20%;
        text-align: center;
    }
    .text-center{
        text-align: center;
        font-size: 13px;
        color: #969799;
    }
    .load-bottom{
        width: 100%;
        padding: 10px;
    }
</style>