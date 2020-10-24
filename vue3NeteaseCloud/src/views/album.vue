<template>
    <div class="album">
        <template v-if="album.name">
            <head-nav 
            :title="album.name"
            :fun="back"
        />
        <div class="album-cover-box">
            <div class="album-cover">
                <img class="album-poster" :src="album.picUrl" alt="">
                <div class="simple-info">
                    <h4>{{ album.name }}</h4>
                    <p>
                        <img :src="album.artist&&album.artist.picUrl" alt="">
                        <span class="singer-name">{{ album.artist&&album.artist.name }}</span>
                    </p>
                    <time>发行时间：{{timeFormat(album.publishTime)}}</time>
                </div>
            </div>
            <img class="album-box-bg" :src="album.blurPicUrl" alt="">
        </div>
        <div id="navbar" class="navbar">
            <div class="mint-navbar">
                <a :class="['mint-tab-item', {'is-selected': tabOn==0}]" @click.stop="tabOn = 0">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">专辑歌曲</div>
                </a>
                <a :class="['mint-tab-item', {'is-selected': tabOn==1}]" @click.stop="tabOn = 1">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">专辑简介</div>
                </a>
            </div>
        </div>
        <div style="padding-bottom: 50px" v-show="tabOn == 0">
            <div class="play-all" @click.stop="playAll">
                <van-icon name="play-circle-o"/>
                播放全部
            </div>
            <play-item 
                :song="item.name"
                :info="albumAndSinger(item.al, item.ar)"
                v-for="(item) of songs" :key="item.id"
                @click.stop="toPlaySong(item)"
            />
        </div>
        <div class="album-intr" style="padding-bottom: 50px" v-show="tabOn == 1">
            {{ album.description }}
        </div>
        </template>
    </div>
</template>

<script>
    import HeadNav from '@/components/header/headNav.vue';
    import PlayItem from '@/components/songItem.vue';
    import { useRouter } from 'vue-router';
    import { ref, reactive, toRefs, computed, } from 'vue';
    import { getAlbum } from '@/api/album';
    import { loading, loaded, albumAndSinger, timeFormat, toPlay, } from '@/tools/common';
    import { useStore } from 'vuex';
    import { Icon, } from 'vant';

    export default {
        name: 'Album',
        components: {
            'head-nav': HeadNav,
            'play-item': PlayItem,
            'van-icon': Icon,
        },
        setup() {
            const router = useRouter();
            const tabOn = ref(0);
            let id = router.currentRoute.value.params.id;
            const albumObj = reactive({
                album: {},
                songs: []
            });
            const store = useStore();
            let getAudioHistory = computed(() => store.getters.getAudioHistory); //播放记录

            function back() {
                router.back();
            }

            async function getAlbumInfo() {
                loading();
                let res = await getAlbum(id);
                // console.log(res);
                albumObj.album = res.album;
                albumObj.songs = res.songs;
                loaded();
            }

            function toPlaySong(item) {
                toPlay(item, store, getAudioHistory)
            }

            function playAll() { //播放全部
                /**
                 * 第一步，把全部专辑里的歌曲list取出来，去重后加入历史记录
                 * 第二步，将专辑第一首切换为当前播放，并更新store
                 * 第三部，重新计算激活下标值
                 */
                // console.log(albumObj.songs);
                // console.log(getAudioHistory);
                let historyArr = getAudioHistory.value, //历史数组
                    songList = albumObj.songs, //专辑数组
                    needAddArr = []; //需要往历史数组里添加的数组
                
                songList.map(item => {
                    for(let i = 0; i < historyArr.length; i ++) {
                        if(historyArr[i].id == item.id) { //有存在
                            historyArr.splice(i, 1);
                            i --;
                            break;
                        }
                    }
                    needAddArr.push({
                        url: '',
                        singer: item.ar[0].name,
                        song: item.name,
                        poster: item.al.picUrl,
                        id: item.id
                    });
                })

                let firstItem = songList[0];
                historyArr.unshift(...needAddArr);
                store.dispatch('setAudioHistory', historyArr)
                .then(() => {
                    toPlay(firstItem, store);
                })
            }

            getAlbumInfo();
            
            return {
                back,
                tabOn,
                ...toRefs(albumObj),
                albumAndSinger,
                timeFormat,
                toPlaySong,
                playAll,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
    
    .album {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
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