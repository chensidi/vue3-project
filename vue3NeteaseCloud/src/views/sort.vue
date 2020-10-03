<template>
    <div class="box-wrap">
        <div class="sort-wrap">
            <h3 class="sort-title">榜单推荐</h3>
            <sort-pannel :list="recommendList" />
            <h3 class="sort-title">官方榜</h3>
            <track-pannel :list="gfList" />
            <h3 class="sort-title">特色榜</h3>
            <sort-pannel :list="tsList" />
            <h3 class="sort-title">全球榜</h3>
            <sort-pannel :list="globalList" />
            <h3 class="sort-title">地区榜</h3>
            <sort-pannel :list="areaList" />
            <h3 class="sort-title">曲风榜</h3>
            <sort-pannel :list="styleList" />
            <h3 class="sort-title">更多榜单</h3>
            <sort-pannel :list="moreList" />
        </div>
    </div>
</template>

<script>
    import { getTopList } from '@/api/sort.js';
    import { ref, reactive, toRefs, onActivated } from 'vue';
    import { onBeforeRouteLeave } from 'vue-router';
    import SortPannel from '@/components/sort/sortPannel.vue';
    import TrackPannel from '@/components/sort/trackPannel.vue';
    import { loading, loaded } from '@/tools/common.js';
    export default {
        name: 'Sort',
        components: {
            'sort-pannel': SortPannel,
            'track-pannel': TrackPannel
        },
        setup() {
            const recommendList = ref([]),
                  gfList = ref([]),
                  tsList = ref([]),
                  globalList = ref([]),
                  areaList = ref([]),
                  styleList = ref([]),
                  moreList = ref([])
            
            const data = reactive({
                recommendList: [],
                gfList: [],
                tsList: [],
                globalList: [],
                areaList: [],
                styleList: [],
                moreList: []
            })

            let top = 0;

            onActivated(() => {
                document.getElementsByClassName('box-wrap')[0].scrollTo(0, top);
            })

            onBeforeRouteLeave((to, from, next) => {
                top = document.getElementsByClassName('box-wrap')[0].scrollTop;
                next();
            })
            
            async function getTopLists() {
                loading();
                let res = await getTopList();
                // console.log(res);
                data.gfList= res.slice(0, 4);
                data.recommendList = res.slice(4, 7);
                data.tsList = res.slice(7, 10);
                data.globalList = res.slice(9, 12);
                data.areaList = res.slice(12, 15);
                data.styleList = res.slice(15, 18);
                data.moreList = res.slice(18, );
                setTimeout(() => {
                    loaded();
                }, 1000)
            }

            function trackFormat(trackObj) {
                return `${trackObj.first} - ${trackObj.second}`
            }

            getTopLists();

            return {
                ...toRefs(data),
                trackFormat
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
    .sort-wrap{
        padding: 20px 15px;
    }
    .sort-title{
        font-size: .9rem;
        line-height: 2.5;
    }
</style>