<template>
        <van-swipe class="my-swipe" indicator-color="white" v-if="list.length">
            <van-swipe-item v-for="(item) of list" :key="item.encodeId">
                <img :src="item.imageUrl" alt="">
            </van-swipe-item>
        </van-swipe>
</template>

<script>
    import { Swipe, SwipeItem } from 'vant';
    import { ref, reactive } from 'vue';
    import getImgs from './getImgs.js';
    export default {
        name: 'Banners',
        components: {
            'van-swipe': Swipe,
            'van-swipe-item': SwipeItem
        },
        setup() {
            const list = ref([]); //banner列表
            
            async function loadData() { //获取banner
                let res = await getImgs();
                list.value = res;
            }
            loadData();
            
            return {
                list
            }
        }
    }
</script>

<style lang="scss" scoped>
    .my-swipe {
        img{
            width: 100%;
        }
    }
</style>