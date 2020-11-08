<template>
    <div class="sort-details">
        <head-nav 
            :title="sortDetails.name"
            :fun="back"
        />
        <div class="album-cover-box">
            <div class="album-cover">
                <img class="album-poster" :src="sortDetails.coverImgUrl" alt="">
                <div class="simple-info">
                    <h4>{{sortDetails.name}}</h4>
                    <p>
                        <img :src="sortDetails.avatarUrl" alt="">
                        <span class="singer-name">{{sortDetails.creator}}</span>
                    </p>
                    <time>更新时间：{{timeFormat(sortDetails.updateTime)}}</time>
                </div>
            </div>
            <img class="album-box-bg" :src="sortDetails.coverImgUrl" alt="">
        </div>
        <div id="navbar" class="navbar">
            <div class="mint-navbar">
                <a :class="['mint-tab-item', {'is-selected': tabOn==0}]" @click.stop="tabOn = 0">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">歌曲</div>
                </a>
                <a :class="['mint-tab-item', {'is-selected': tabOn==1}]" @click.stop="tabOn = 1">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">简介</div>
                </a>
            </div>
        </div>
        <div style="padding-bottom: 50px" v-show="tabOn == 0">
            <div class="play-all" @click.stop="playAll(getAudioHistory,sortDetails.songs, store)">
                <van-icon name="play-circle-o"/>
                播放全部
            </div>
            <play-item 
                :song="item.name"
                :info="albumAndSinger(item.al, item.ar)"
                v-for="(item) of sortDetails.songs" :key="item.id"
                @click.stop="toPlaySong(item)"
            />
        </div>
        <div class="album-intr" style="padding-bottom: 50px" v-show="tabOn == 1">
            {{ sortDetails.description }}
        </div>
    </div>
</template>

<script>
    import { 
        useRoute, 
        useRouter, 
    } from 'vue-router';
    import { 
        ref, 
        reactive,
        computed,
    } from 'vue';
    import { useStore } from 'vuex';
    import HeadNav from '@/components/header/headNav.vue';
    import PlayItem from '@/components/songItem.vue';
    import { getTopDetails } from '@/api/sort.js';
    import { loading, loaded, albumAndSinger, timeFormat, toPlay, playAll, } from '@/tools/common';
    import { Icon } from 'vant';

    export default {
        name: 'SortDetails',
        components: {
            'head-nav': HeadNav,
            'play-item': PlayItem,
            'van-icon': Icon,
        },
        setup() {
            const route = useRoute(),
                  router = useRouter();
            const store = useStore();

            const sortDetails = reactive({
                name: route.query.name
            });

            const tabOn = ref(0);

            let getAudioHistory = computed(() => store.getters.getAudioHistory); //播放记录

            
            function back() {
                router.back();
            }

            async function loadData() {
                loading();
                let res = await getTopDetails(route.query.id);
                sortDetails.coverImgUrl = res.playlist.coverImgUrl;
                sortDetails.creator = res.playlist.creator.nickname;
                sortDetails.avatarUrl = res.playlist.creator.avatarUrl;
                sortDetails.updateTime = res.playlist.updateTime;
                sortDetails.songs = res.playlist.tracks;
                sortDetails.description = res.playlist.description;
                loaded();
            }

            function toPlaySong(item) {
                toPlay(item, store, getAudioHistory)
            }

            loadData();

            return {
                sortDetails,
                back,
                timeFormat,
                tabOn,
                albumAndSinger,
                playAll,
                toPlaySong,
                getAudioHistory,
                store,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
    .sort-details{
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
        background-color: #fff;
        overflow: auto;
    }
    .album-cover-box{
        overflow: hidden;
        position: relative;
    }
    .album-cover{
        padding: 64px 16px 20px;
        background: rgba(0,0,0,.5);
        @include flex(center, flex-start);
        z-index: 5;
        position: relative;
    }
    .album-poster{
        width: 125px;
        height: 125px;
        object-fit: cover;
    }
    .simple-info{
        margin-left: 10px;
        color: #fff;
        h4{
            font-size: 18px;
            font-weight: 400;
            line-height: 1.5;
            margin: 10px 0;
        }
        img{
            width: 24px;
            height: 24px;
            margin-right: 5px;
            border-radius: 50%;
            vertical-align: middle;
        }
        time{
            margin-top: 8px;
            font-size: 12px;
        }
        .singer-name{
            font-size: 14px;
        }
    }
    .album-box-bg{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(36px);
        transform: scale(1.1);
    }

    .navbar{
        height: 50px;
        background-color: #fff;
        letter-spacing: 3px;
    }
    .mint-navbar {
        background-color: #fff;
        text-align: center;
        display: flex;
    }
    .mint-tab-item {
        display: block;
        padding: 7px 0;
        flex: 1;
        text-decoration: none;
        padding: 17px 0;
        font-size: 15px;
        border-bottom: 3px solid #fff;
        &.is-selected {
            border-bottom: 3px solid #31c27c;
            color: #31c27c;
            // margin-bottom: -3px;
        }
    }
    .mint-tab-item-icon:empty {
        display: none;
    }
    .mint-tab-item-icon {
        width: 24px;
        height: 24px;
        margin: 0 auto 5px;
    }
    
    .mint-tab-item-label {
        font-size: 14px;
        color: inherit;
        line-height: 1;
    }
    .album-intr{
        padding: 10px 30px 50px;
        font-size: 14px;
        color: #777;
        text-indent: 2em;
        line-height: 2;
    }
    .play-all{
        @include flex(center, flex-start);
        padding: 10px;
        font-size: 15px;
        /deep/ .van-icon{
            font-size: 25px;
            margin-right: 5px;
        }
    }
</style>

