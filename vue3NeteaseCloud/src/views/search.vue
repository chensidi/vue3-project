<template>
    <div class="box-wrap">
        <search-bar 
            @toSearch="toSearch"
            @clear="onClearSearch"
            :searchVal="searchVal"
            @inputChanges="onInputChanges"
            @focused="onFocus"
        />
        <section class="m-hotlist" v-show="isSearch === false">
            <h3 class="title">热门搜索</h3>
            <ul class="list">
                <li @click.stop="chooseHot(item.searchWord)" class="item f-bd f-bd-full" v-for="(item) of hotLists" :key="item.score">
                    <a class="link" href="javascript:void(0);">{{ item.searchWord }}</a>
                </li>
            </ul>
        </section>

        <section class="m-recom" v-show="isSearch === true">
            <h3 class="title f-bd f-bd-btm f-thide">搜索“{{ searchVal }}”</h3>
            <ul class="suggest-list">
                <li @click.stop="chooseHot(item.keyword)" v-for="(item) of suggestList" :key="item.keyword">
                    <van-icon name="search" />
                    <span class="sear-name f-bd f-bd-btm f-thide">{{ item.keyword }}</span>
                </li>
            </ul>
        </section>


        <van-list
            v-model:loading="loadMoreObj.loading"
            :finished="loadMoreObj.finished"
            finished-text="没有更多了"
            @load="onLoad"
            v-show="isSearch === null"
        >
            <div @click.stop="toPlay(item)" class="list-item" v-for="(item) of loadMoreObj.songlists" :key="item.id">
                <div class="f-bd f-bd-btm">
                    <div class="item-main">
                        <p class="song-name">
                            {{ item.name }}
                        </p>
                        <p class="song-info">
                            {{ albumAndSinger(item.al, item.ar) }}
                        </p>
                    </div>
                    <div class="item-icon">
                        <van-icon name="play-circle-o" />
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
    import SearchBar from '@/components/searchBar/searchBar.vue';
    import { reactive, ref, computed, } from 'vue';
    import { useStore } from 'vuex';
    import { getHotSearch, getSuggestSearch, getSearchByKw, getSongUrl } from '@/api/search.js';
    import { Icon, List } from 'vant';
    import { loading, loaded, albumAndSinger } from '@/tools/common';
    export default {
        name: 'Search',
        components: {
            'search-bar': SearchBar,
            'van-icon': Icon,
            'van-list': List
        },
        setup() {

            const hotLists = ref([]);
            const searchVal = ref('');
            const isSearch = ref(false);
            const suggestList = ref([]);
            let oldSearch = '';
            const searchResult = ref([]);
            let oldSearchKw = '';
            const store = useStore();

            const loadMoreObj = reactive({ //下拉加载更多列表对象
                loading: false,
                finished: false,
                songlists: []
            })

            function toSearch(val) { //执行搜索
                searchVal.value = val.trim();
                if(val.trim() != '') {
                    isSearch.value = null;
                    // console.log(oldSearch.value, searchVal.value)
                    if(loadMoreObj.finished) {
                        loadMoreObj.songlists = [];
                        loadMoreObj.finished = false;
                    }else {
                        if(oldSearchKw != searchVal.value) { //更新了搜索字段
                            loadMoreObj.songlists = [];
                            loadMoreObj.finished = false;
                            getSearchByKws();
                        }else {
                            getSearchByKws();
                        }
                    }
                }
            }

            function onClearSearch() { //取消搜索
                isSearch.value = false;
            }

            async function getHotSearchs() { //热门搜索列表
                loading();
                let res = await getHotSearch();
                setTimeout(() => {
                    loaded();
                }, 500)
                // console.log(res);
                hotLists.value = res;
            }

            function chooseHot(sear) { //点击选择热门搜索
                searchVal.value = sear;
                console.log(searchVal.value);
                isSearch.value = null;
                if(loadMoreObj.finished) {
                    loadMoreObj.songlists = [];
                    loadMoreObj.finished = false;
                }else {
                    loadMoreObj.songlists = [];
                    loadMoreObj.finished = false;
                    getSearchByKws();
                }
            }

            function onInputChanges(val) { //输入框变化
                searchVal.value = val.trim();
                if(val.trim() != '') {
                    isSearch.value = true;
                    getSuggestSearches(searchVal.value);
                }else {
                    isSearch.value = false;
                }
            }

            function onFocus() { //聚焦
                // console.log(searchVal.value);
                if(searchVal.value != '') {
                    isSearch.value = true;
                    if(oldSearch !== searchVal.value) {
                        getSuggestSearches(searchVal.value);
                    }
                }else {
                    isSearch.value = false;
                }
            }

            async function getSuggestSearches(val) { //获取建议搜索
                loading('搜索中');
                let res = await getSuggestSearch(val);
                // console.log(res);
                loaded();
                if(res.allMatch) {
                    suggestList.value = res.allMatch;
                    oldSearch = searchVal.value; //搜索后记录上次值
                }
            }

            async function getSearchByKws() { //根据关键字搜索的结果
                oldSearchKw = searchVal.value;
                let len = loadMoreObj.songlists.length;
                let res = await getSearchByKw(searchVal.value, 30, len);
                // console.log(res);
                loadMoreObj.loading = false;
                let { songs=[] } = res;
                if(songs.length > 0) {
                    loadMoreObj.songlists = loadMoreObj.songlists.concat(songs);
                    // console.log(loadMoreObj.songlists);
                }else {
                    loadMoreObj.finished = true;
                }
            }


            function onLoad() { //when加载
                getSearchByKws();
            }

            let getAudioHistory = computed(() => store.getters.getAudioHistory); //播放记录

            async function toPlay(item) { //点击播放
                // console.log(item);
                loading('歌曲下载中...');
                let res = await getSongUrl(item.id); //下载歌曲
                // console.log(res);
                store.dispatch('setAudioInfo', { //更新store
                    url: res.url,
                    singer: item.ar[0].name,
                    song: item.name,
                    poster: item.al.picUrl,
                    id: item.id
                }).then(() => {
                    setTimeout(() => {loaded()}, 500)
                })

                let tempHistory;
                if(getAudioHistory.value.length === undefined) { //没有记录
                    tempHistory = [];
                }else {
                    tempHistory = getAudioHistory.value;
                }
                let key = false;
                for(let i = 0; i < tempHistory.length; i ++) {
                    if(tempHistory[i].id == item.id) { //之前就存在过
                        key = true;
                        break;
                    }
                }
                if(!key) {
                    tempHistory.push({
                        url: res.url,
                        singer: item.ar[0].name,
                        song: item.name,
                        poster: item.al.picUrl,
                        id: item.id
                    })
                    store.dispatch('setAudioHistory', tempHistory); //更新播放记录
                }
            }

            getHotSearchs();

            return {
                toSearch,
                onClearSearch,
                hotLists,
                chooseHot,
                searchVal,
                isSearch,
                onInputChanges,
                onFocus,
                suggestList,
                loadMoreObj,
                onLoad,
                albumAndSinger,
                toPlay,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @mixin flex($x: center, $y: space-between) {
        display: flex;
        align-items: $x;
        justify-content: $y;
    }
    @mixin elp{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .m-hotlist{
        padding: 15px 10px 0;
        .title {
            font-size: 12px;
            line-height: 12px;
            color: #666;
        }
        .list {
            margin: 10px 0 7px;
        }
        .item {
            display: inline-block;
            height: 32px;
            margin-right: 8px;
            margin-bottom: 8px;
            padding: 0 14px;
            font-size: 14px;
            line-height: 32px;
            color: #333;

            &::after {
                border-color: #d3d4da;
                border-radius: 32px;
            }
        }
    }
    .f-bd {
        position: relative;

        &::after{
            position: absolute;
            z-index: 2;
            content: "";
            top: 0;
            left: 0;
            pointer-events: none;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            transform-origin: top left;
            border: 0 solid rgba(0,0,0,.1);
        }
    }
    .f-bd-full:after {
        border-width: 1px;
    }

    a{
        color: #333;
        &:visited{
            color: #333;
        }
    }

    .m-recom {
        margin: 0 auto;
        .title {
            height: 50px;
            margin-left: 10px;
            padding-right: 10px;
            font-size: 15px;
            line-height: 50px;
            color: #507daf;
            font-weight: normal;

            &::after {
                border-color: rgba(0,0,0,.1);
            }
        }
    }
    .f-thide {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
    }
    .f-bd-btm:after {
        border-bottom-width: 1px;
    }

    .suggest-list{
        li{
            height: 45px;
            @include flex(center, flex-start);
            color: #333;
            font-size: 15px;
            padding-left: 10px;
        }
    }

    .jacky-search{
        margin-right: 7px;
    }

    .sear-name{
        margin-left: 7px;
        padding-right: 10px;
        flex: 1;
        line-height: 45px;
        @include elp;
    }

    .list-item{
        padding-left: 10px;
        color: #333;
        .item-main{
            padding: 6px 0;
            flex: 1;
            overflow: hidden;
        }
        .item-icon{
            padding: 0 10px;
        }
        .song-name{
            font-size: 17px;
            @include elp;
        }
        .song-info{
            font-size: 12px;
            color: #888;
            @include elp;
        }
        >div{
            @include flex;
        }
    }
</style>