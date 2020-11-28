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
                        <div class="album-item" @click.stop="goAlbum(item)" v-for="item in list1" :key="item.id">
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
            <div v-show="tabOn==2">
                <div class="mv-wrap">
                    <div class="mv-item" @click.stop="showMv(item)" v-for="(item) of mvList" :key="item.id">
                        <div class="mv-box">
                            <div class="mv-cover">
                                <img :src="item.imgurl" alt="">
                                <div class="mv-data">
                                    <time>
                                        {{ item.publishTime }}
                                    </time>
                                    <span>
                                        <van-icon name="play-circle-o" /> {{ numFormat(item.playCount) }}
                                    </span>
                                </div>
                            </div>
                            <p class="van-ellipsis mui_list__tit">
                                {{ item.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="tabOn == 3" class="desc-wrap">
                <h4>{{ name }}简介</h4>
                <p>
                    {{ descOfSinger.briefDesc }}
                </p>
                <div v-if="descOfSinger.introduction">
                    <template v-for="(item) of descOfSinger.introduction" :key="item.ti">
                        <h4>{{ item.ti }}</h4>
                        <p>{{ item.txt }}</p>
                    </template>
                </div>
            </div>
        </div>
        
        <van-overlay 
            :show="showMVPlay.show" 
            @click.self="showMVPlay.show = false"
            z-index='999'
        >
            <!-- <div class="video-box" @click.stop>
                <video ref="video" preload="" controls :src="showMVPlay.url" :poster="showMVPlay.cover"></video>
                <span class="br-tilte">分辨率：</span> <van-button type="primary" @click.stop="changeBrs(br)" v-for="br of showMVPlay.brs" :key="br">{{ br + 'P' }}</van-button>
            </div> -->
        </van-overlay>
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
    <!-- <transition name="slide">
		<router-view></router-view>
	</transition> -->
	<!-- <router-view v-slot="{ Component }">
        <transition>
            <component :is="Component" />
        </transition>
    </router-view> -->

</template>

<script>
    import { Icon, List, Dialog, Overlay, Button, } from 'vant';
    import { ref, reactive, toRefs, onMounted, computed, nextTick, watch, toRef } from 'vue';
    import { useRouter, onBeforeRouteLeave, } from 'vue-router';
    import { 
        getSingerAlbum, 
        getSingerSong, 
        getSingerMV, 
        getMVUrl, 
        getSingerDesc,
        getMVDetails,
    } from '@/api/singer';
    import { useStore } from 'vuex';
    import { toPlay, lazyLoadImg, timeFormat, numFormat, loading, loaded, } from '@/tools/common.js';
    import VideoComponent from '@/components/video/VideoComponent.vue';
    export default {
        name: 'SingerDetails',
        components: {
            'van-icon': Icon,
            'van-list': List,
            'van-dialog': Dialog,
            'van-overlay': Overlay,
            'van-button': Button,
            'video-component': VideoComponent
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
            const mvList = ref([]);
            const showMVPlay = reactive({
                show: false,
                url: '',
                cover: ''
            })
            let showMvRef = toRef(showMVPlay, 'show');

            const video = ref(null);
            const descOfSinger = reactive({});

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

            async function showMv(item) {
                // console.log(item);
                loading();
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

            onMounted(() => {
                // window.onscroll = function(){
                //     fixedTop();
                // }
                window.addEventListener('scroll', fixedTop);
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
            getSingerMVs();

            function toPlaySong(item){
                toPlay(item, store, getAudioHistory);
            }

            function goAlbum(item) {
                // console.log(item);
                router.push({name: 'Album', params: {id: item.id}})
            }

            async function getSingerMVs() {
                let res = await getSingerMV(id, 20, mvList.value.length);
                mvList.value = res;
            }

            async function getSingerDescs() { //获取歌手简介
                let res = await getSingerDesc(id);
                Object.keys(res).map(key => {
                    descOfSinger[key] = res[key];
                })
            }

            async function changeBrs(br) { //分辨率切换
                console.log(br);
                let url = await getMVUrl(showMVPlay.id, br);
                showMVPlay.url = url;
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
                if(now == 3) {
                    if(Object.keys(descOfSinger).length == 0) {
                        getSingerDescs();
                    }
                }
            })

            let MVShow = toRef(showMVPlay, 'show');

            watch(MVShow, (now) => {
                if(now) { //播放mv，将div层级提高
                    document.querySelector('.singer').style.zIndex = 999;
                } else {
                    document.querySelector('.singer').style.zIndex = '';
                }
            })

            /*
            watch(showMvRef, (now) => {
                let videoDom = document.querySelector('video');
                nextTick(() => {
                    if(!now) {
                        video.value.pause();
                    }else {
                        try {
                            video.value.play();
                        }catch(e) {
                            console.log(videoDom)
                            videoDom.oncanplay = function() {
                                video.value.play();
                            }
                        }
                    }
                })
            })
            */
            // getSingerSongs();
            onBeforeRouteLeave((to, from ,next) => {
                // console.log(to);
                window.removeEventListener('scroll', fixedTop);
                // let keepArr = store.getters.getKeep;
                // keepArr.push('SingerDetails');
                // keepArr = [...new Set(keepArr)]
                // if(to.name == "Album") {
                //     store.dispatch('setKeep', keepArr);
                // }
                next();
            })

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
                goAlbum,
                mvList,
                numFormat,
                showMv,
                showMVPlay,
                video,
                descOfSinger,
                changeBrs,
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
    .mv-wrap{
        padding: 10px 12px;
        .mv-item{
            width: 50%;
            vertical-align: top;
            display: inline-block;
            margin-bottom: 14px;
            font-size: 12px;
            .mv-box{
                margin: 0 4px;
                font-size: 12px;
            }
            .mv-cover{
                position: relative;
                >img{
                    width: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }
            }
            .mv-data{
                @include flex;
                bottom: 5px;
                position: absolute;
                width: 100%;
                color: #fff;
                padding: 0 10px;
            }
            .mui_list__tit {
                margin-top: 5px;
                font-size: 14px;
                color: #1a1a1a;
            }
        }
    }

    .video-box{
        position: absolute;
        font-size: 0;
        background: #fff;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
        video{
            width: 100%;
        }
        .van-button--normal{
            padding: 0 0.75rem;
            margin: 5px;
        }
    }
    .desc-wrap{
        padding: 10px;
        h4{
            line-height: 2.5;
            font-weight: normal;
            position: relative;
            padding: {
                left: 10px;
            }
            &::before{
                content: '';
                width: 2px;
                height: 1em;
                background: #C20C0C;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                display: block;
            }
        }
        p{
            font-size: 14px;
            color: #333;
        }
    }
    .br-tilte{
        font-size: 14px;
        padding: 0 5px;
    }
    .album-cover{
        padding: 0 !important;
    }
</style>