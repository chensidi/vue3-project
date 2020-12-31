<template>
   <div class="sort-details" ref="box">
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
        <div id="navbar" class="navbar" :class="{'fixed': fixedH}">
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
        onMounted,
    } from 'vue';
    import { useStore } from 'vuex';
    import HeadNav from '@/components/header/headNav.vue';
    import PlayItem from '@/components/songItem.vue';
    import { getTopDetails } from '@/api/sort.js';
    import { loading, loaded, albumAndSinger, timeFormat, toPlay, playAll, } from '@/tools/common';
    import { Icon } from 'vant';
    export default {
        name: 'PlayList',
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

            const box = ref('box');
            const fixedH = ref(false);
            
            function back() {
                router.back();
            }

            async function loadData() {
                loading();
                let res = await getTopDetails(route.params.id);
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

            function scrollHandler() {
                let h = document.querySelector('#navbar').getBoundingClientRect().top,
                    height = document.querySelector('.page-header').getBoundingClientRect().height;
                box.value.addEventListener('scroll', (e) => {
                    console.log(box.value.scrollTop, h)
                    if(box.value.scrollTop >= h - height) {
                        fixedH.value = true;
                    }else {
                        fixedH.value = false;
                    }
                })
            }

            onMounted(() => {
                scrollHandler();
            })

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
                box,
                fixedH
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fixed{
        position: fixed;
        width: 100%;
        left: 0;
        z-index: 1;
        top: 44px;
    }
</style>