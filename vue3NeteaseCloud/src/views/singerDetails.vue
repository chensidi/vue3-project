<template>
    <div class="singer">
        <div class="page-header"
            :style="{'background-image': 'url('+ pic +')'}"
        >
            <van-icon name="arrow-left" @click.stop="back" />
            <h3 class="title">{{ name }}</h3>
        </div>
        <div class="background" :class="{'filter':isAddFilter}"
            :style="{'background-image': 'url('+ pic +')'}"
        >
        </div>
        <div id="navbar" class="navbar">
            <div class="mint-navbar">
                <a :class="['mint-tab-item', {'is-selected': tabOn==0}]" @click.stop="tabOn = 0">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">歌曲</div>
                </a>
                <a :class="['mint-tab-item', {'is-selected': tabOn==1}]" @click.stop="tabOn = 1">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">专辑</div>
                </a>
                <a :class="['mint-tab-item', {'is-selected': tabOn==2}]" @click.stop="tabOn = 2">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">MV</div>
                </a>
                <a :class="['mint-tab-item', {'is-selected': tabOn==3}]" @click.stop="tabOn = 3">
                    <div class="mint-tab-item-icon"></div> 
                    <div class="mint-tab-item-label">关于TA</div>
                </a>
            </div>
        </div>
        <div class="main mint-tab-container" id="main">
            <div v-if="tabOn==0">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    >
                    <div class="list-item">
                        <div class="f-bd f-bd-btm" @click.stop="toPlaySong(item)" v-for="item in list" :key="item.id">
                            <div class="item-main">
                                <p class="song-name">
                                    {{ item.name }}
                                </p>
                                <p class="song-info">
                                    {{ name }}
                                </p>
                            </div>
                            <div class="item-icon">
                                <van-icon name="play-circle-o" />
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>
            <div v-if="tabOn==1">
                <van-list
                    v-model:loading="loading1"
                    :finished="finished1"
                    finished-text="没有更多了"
                    @load="onLoad1"
                >
                    <div id="album-box">
                        <div class="album-item" v-for="item in list1" :key="item.id">
                            <div class="album-info">
                                <img class="album-cover" src="../assets/cover.png" :data-src="item.picUrl" alt="">
                                <div>
                                    <h4 class="van-multi-ellipsis--l2">{{ item.name }}</h4>
                                    <p>{{timeFormat(item.publishTime)}} {{item.size}}首</p>
                                </div>
                            </div>
                            <van-icon name="arrow" />
                        </div>
                    </div>
                </van-list>
            </div>
            <div v-show="tabOn==2">3</div>
        </div>
    </div>
</template>

<script>
    import { Icon, List, } from 'vant';
    import { ref, reactive, toRefs, onMounted, computed, nextTick, watch, } from 'vue';
    import { useRouter } from 'vue-router';
    import { getSingerAlbum, getSingerSong, } from '@/api/singer';
    import { toPlay } from '@/tools/common.js';
    import { useStore } from 'vuex';
    import { lazyLoadImg, timeFormat, } from '@/tools/common.js';
    export default {
        name: 'SingerDetails',
        components: {
            'van-icon': Icon,
            'van-list': List,
        },
        setup() {
            const store = useStore();
            const tabOn = ref(0); //激活选项卡
            const songObj = reactive({ //单曲对象
                loading: false,
                finished: false,
                list: []
            })
            const albumObj = reactive({
                loading1: false,
                finished1: false,
                list1: []
            })
            const singerObj = reactive({
                name: '',
                sd: '',
                pic: ''
            })
            const isAddFilter = ref(false); //背景模糊
            const router = useRouter();
            let id = router.currentRoute.value.query.id;
            let getAudioHistory = computed(() => store.getters.getAudioHistory); //播放记录

            function onLoad() {
                getSingerSongs();
            }

            function onLoad1() {
                getAlbums();
            }

            function fixedTop() {
                let navbar = document.getElementById('navbar')
				let main = document.getElementById('main');
				let top = document.documentElement.scrollTop;
				if (top >= 230) {
					navbar.classList.add('fiexd-top');
					//防止滚动条跳动
					main.style.marginTop = "320px";
				}else{
					navbar.classList.remove('fiexd-top');
					main.style.marginTop = 0;
                }
                top > 0 ? isAddFilter.value = true : isAddFilter.value = false;
            }

            function back() {
                router.back();
            }

            onMounted(() => {
                window.onscroll = function(){
                    fixedTop();
                }
            })

            async function getAlbums() { //获取专辑
                let res = await getSingerAlbum(id, 20, albumObj.list1.length);
                let art = res.artist;
                singerObj.name = art.name;
                singerObj.sid = art.id;
                singerObj.pic = art.picUrl;

                let {hotAlbums = []} = res;
                if(hotAlbums.length) {
                    albumObj.list1 = albumObj.list1.concat(hotAlbums);
                    albumObj.loading1 = false;
                    nextTick(() => {
                        let albumCovers = document.getElementsByClassName('album-cover');
                        albumCovers = Array.from(albumCovers).slice(-20);
                        albumCovers.forEach(item => {
                            lazyLoadImg(item, {
                                root: document.getElementById('album-box'),
                                threshold: 0,
                                rootMargin: '0px 0px 0px 0px'
                            })
                        })
                    })
                }else {
                    albumObj.finished1 = true;
                }
            }

            async function getSingerSongs(){
                let res = await getSingerSong(id, 20, songObj.list.length);
                // console.log(res);
                if(res.length) {
                    res.map(item => {
                        item.al.picUrl = singerObj.pic;
                    })
                    songObj.list = songObj.list.concat(res);
                    songObj.loading = false;
                }else {
                    songObj.finished = true;
                }
            }

            getAlbums();
            function toPlaySong(item){
                toPlay(item, store, getAudioHistory);
            }

            watch(tabOn, (now) => {
                if(now == 1) {
                    let albumCovers = document.getElementsByClassName('album-cover');
                    albumCovers = Array.from(albumCovers).slice(0, 20);
                    albumCovers.forEach(item => {
                        lazyLoadImg(item, {
                            root: document.getElementById('album-box'),
                            threshold: 0,
                            rootMargin: '0px 0px 0px 0px'
                        })
                    })
                }
            })
            // getSingerSongs();

            return {
                tabOn,
                ...toRefs(songObj),
                onLoad,
                onLoad1,
                isAddFilter,
                back,
                ...toRefs(singerObj),
                toPlaySong,
                ...toRefs(albumObj),
                timeFormat,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
    
    .singer{
		position: absolute;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
    .page-header {
        position: fixed;
        z-index: 20;
        top: 0;
        left: 0;
        width: 100%;
        height: 44px;
        line-height: 44px;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url(../assets/cover.png);
        i{
            position: absolute;
            z-index: 10;
            left: 15px;
            font-size: 25px;
            color: #fff;
            line-height: 44px;
        }
        &::before{
            content: "";
            position: absolute;
            z-index: 8;
            top: 0;
            left: 0;
            width: 100%;
            height: 44px;
            background-color: hsla(0,0%,4%,.2);
        }
        h3{
            position: absolute;
            z-index: 9;
            width: 100%;
            height: 44px;
            font-size: 18px;
            font-weight: 400;
            color: #fff;
            text-align: center;
        }
    }
    .background {
        position: fixed;
        z-index: -1;
        width: 100%;
        height: 274px;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url(../assets/cover.png);
        &::before{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 274px;
            background-color: hsla(0,0%,4%,.2);
        }
    }
    .navbar{
        height: 50px;
        margin-top: 274px;
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
    .main {
        background-color: #fff;
        margin-bottom: 80px;
    }
    .mint-tab-container {
        overflow: hidden;
        position: relative;
    }
    .fiexd-top {
        position: fixed;
        z-index: 40;
        top: 44px;
        left: 0;
        width: 100%;
        margin-top: 0;
    }
    .filter{
		filter: blur(2px);
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

    .f-bd-btm:after {
        border-bottom-width: 1px;
    }
    .album-item{
        @include flex();
        padding: 0 16px;
        margin: 6px 0;
        img{
            width: 60px;
            height: 60px;
            border-radius: 6px;
            margin-right: 12px;
        }
        h4{
            line-height: 17px;
            font-size: 14px;
            color: #000;
            font-weight: 400;
        }
        p{
            margin-top: 6px;
            font-size: 12px;
            line-height: 16px;
            color: rgba(0,0,0,.4);
        }
        .album-info{
            @include flex();
        }
    }
</style>