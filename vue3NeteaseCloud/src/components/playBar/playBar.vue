<template>
    <div class="play-bar" v-if="getAudioInfo.url">
        <div class="play-bottom" @click="alertPlayBox">
            <div class="pl-lf">
                <img class="play-poster" :src="getAudioInfo.poster" alt="" :style="{'transform': 'rotate('+ angle +'deg)'}" />
                <div class="play-info">
                    <h4>{{ getAudioInfo.song }}</h4>
                    <p>{{ getAudioInfo.singer }}</p>
                </div>
            </div>
            <div class="play-cpn">
                <van-icon @click.stop="playAndPause" style="display: block;" size="30px" color="#333" :name="!playing?'play-circle-o':'pause-circle-o'" />
            </div>
        </div>
        <audio 
            ref="audio" 
            id="audio" 
            :src="getAudioInfo.url"  
            @ended="onEnd"
            @timeupdate="onTimeUpdate"
        >
        </audio>
        <div :class="['play-pannel', {'show-pannel': showPlayWarp}]">
            <div class="play-bg" :style="{'background-image':'url('+ getAudioInfo.poster +')'}"></div>
            <div class="play-logo" @click.stop="showPlayWarp = false">
                <van-icon name="arrow-left" />
            </div>
            <div class="play-wrap">
                <div class="m-song-disc">
                    <div class="m-song-turn" @click.stop="playAndPause"></div>
                    <div class="m-song-img">
                        <img :src="getAudioInfo.poster" alt="" :style="{'transform': 'rotate('+ angle +'deg)'}" />
                    </div>
                    <!-- <div class="m-song-plybtn" @click.stop="playAndPause" v-show="!playing"></div> -->
                </div>
                <div class="song-lrc">
                    <h2 class="m-song-h2">
                        <span class="m-song-sname">{{ getAudioInfo.song }}</span>
                        <span class="m-song-gap">-</span>
                        <b class="m-song-autr">{{ getAudioInfo.singer }}</b>
                    </h2>
                    <div class="lrc-wrap">
                        <div class="lrc-scroll">
                            <div class="lrc-box" :style="{transform: 'translateY(-' + top +'em)'}">
                                <p v-for="(item, i) of lrcArr" :key="item.time" :class="{'on': on == i}">{{ item.txt }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="option-area">
                <div class="time-bar">
                    <time>{{ timeFormat(start) }}</time>
                    <van-slider v-model="progress" @change="onProgressChange" />
                    <time>{{ timeFormat(end) }}</time>
                </div>
                <div class="option-bar">
                    <span class="rot">
                        <van-icon name="play" @click.stop="cutSong(false)" />
                    </span>
                    <van-icon style="font-size: 30px" :name="!playing?'play-circle-o':'pause-circle-o'" @click.stop="playAndPause" />
                    <span>
                        <van-icon name="play" @click.stop="cutSong(true)" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Icon, Slider, } from 'vant';
    import { ref, reactive, watch, computed, nextTick, toRefs, } from 'vue';
    import { useStore } from 'vuex';
    import { getLrc, getSongUrl } from '@/api/search.js';
    import { loading, loaded } from '@/tools/common.js';

    export default {
        name: 'PlayBar',
        components: {
            'van-icon': Icon,
            'van-slider': Slider,
        },
        setup(props, ctx) {
            const store = useStore();
            const audio = ref(null); //音频ref
            const playing = ref(false);
           
            const show = ref(false);
            const showPlayWarp = ref(false);
            let lrc = '';
            const lrcArr = ref([]);
            const top = ref(0);
            const on = ref(0);
            const progress = ref(0); //进度条
            const timeStamp = reactive({ //时长相关参数
                start: 0,
                end: 0,
                angle: 0
            })
            let timer = null; //旋转计时器
            let songIdx = 0; //歌曲历史记录下标

            function openTimer() {
                let audioDom = audio.value;
                if(audioDom.paused) {
                    clearTimeout(timer);
                    timer = null;
                }else {
                    timer = setTimeout(() => {
                        timeStamp.angle += .25;
                        openTimer();
                    }, 20)
                }
            }
            
            function playAndPause() { //播放&暂停
                let audioDom = audio.value;
                if(audioDom.paused) {
                    audioDom.play();
                    playing.value = true;
                    openTimer();
                }else {
                    audioDom.pause();
                    playing.value = false;
                }
            }

            function onEnd() { //播放结束
                let audioDom = audio.value;
                audioDom.pause();
                playing.value = false;
                cutSong();
            }

            async function alertPlayBox() { //点击底部弹出播放主页面
                let audioDom = audio.value,
                    duration = Math.round(audioDom.duration); //时长
                timeStamp.end = duration;
                if(lrc == '') { //没有歌词
                    loading('歌词加载中...');
                    let res = await getLrc(getAudioInfo.value.id);
                    loaded();
                    lrc = res.lyric;
                    lrcArr.value = formatLrc(lrc);
                    setTimeout(()=>{showPlayWarp.value = true;}, 500)
                }else { //有歌词直接弹出
                    showPlayWarp.value = true;
                }
            }

            function formatLrc(lrc) { //歌词转数组
                let split1 = lrc.split('[')
                split1.shift();
                let split2 = [];
                split1.map((item) => {
                    let temp = item.split(']');
                    let time = temp[0];
                    time = time.split(':');
                    time = parseInt(time[0]) * 60 + Math.round(time[1]);
                    if(temp[1].trim() != '') { //排除空歌词
                        split2.push({
                            time,
                            txt: temp[1]
                        })
                    }
                })
                return split2;
            }

            function onTimeUpdate() { //播放中时间更新
                let audioDom = audio.value !== null ? audio.value : document.getElementById('audio');
                let curTime = Math.round(audioDom.currentTime); //当前毫秒叔
                let duration = Math.round(audioDom.duration); //时长
                progress.value = Math.round(curTime / duration * 100); //当前进度
                timeStamp.start = curTime;
                timeStamp.end = duration;
                if(lrcArr.value.length > 0) {
                    for(let i = 0; i < lrcArr.value.length; i ++) {
                        if(lrcArr.value[i].time == curTime) {
                            on.value = i;
                            if(i > 1 && i < lrcArr.value.length - 2) {
                                let idx = (i - 2) * 2;
                                top.value = idx;
                                break;
                            }
                        }
                    }
                }
            }

            function onProgressChange(val) { //进度条改变
                // console.log(val);
                let audioDom = audio.value,
                    duration = audioDom.duration, //时长
                    cur = duration * val / 100; //改变后的当前进度
                
                timeStamp.start = Math.round(cur);
                audioDom.currentTime = cur;
            }

            function timeFormat(timeStamp) { //320ms ==> 05:20
                let min = parseInt(timeStamp / 60),
                    sec = timeStamp % 60;
                
                min = min.toString().padStart(2, '0');
                sec = sec.toString().padStart(2, '0');

                return min + ':' + sec;
            }

            function computedSongIdx() { //计算歌曲历史记录中的下标位置
                let id = getAudioInfo.value.id;
                for(let i = 0; i < getAudioHistory.value.length; i ++) {
                    let sid = getAudioHistory.value[i].id;
                    if(sid == id) {
                        return i;
                    }
                }
            }

            async function cutSong(flag=true) { //切歌
                songIdx = computedSongIdx();
                if(flag) { //下一首
                    if(songIdx >= getAudioHistory.value.length - 1) { //已经是最后一首
                        songIdx = 0; //归零
                    }else {
                        songIdx ++;
                    }
                }else { //上一首
                    if(songIdx <= 0) { //已经是第一首
                        songIdx = getAudioHistory.value.length - 1; //退到最后一首
                    }else {
                        songIdx --;
                    } 
                }
                // console.log(songIdx);

                let item = getAudioHistory.value[songIdx]; //当前歌曲对象
                loading('歌曲下载中...');
                let res = await getSongUrl(item.id); //下载歌曲
                // console.log(res);
                store.dispatch('setAudioInfo', { //更新store
                    url: res.url,
                    singer: item.singer,
                    song: item.song,
                    poster: item.poster,
                    id: item.id
                }).then(async () => {
                    setTimeout(() => {loaded()}, 500);
                    res = await getLrc(getAudioInfo.value.id);
                    lrc = res.lyric;
                    lrcArr.value = formatLrc(lrc);
                })
                
            }


            let getAudioInfo = computed(() => store.getters.getAudioInfo);

            let getAudioHistory = computed(() => store.getters.getAudioHistory);
            console.log(getAudioHistory.value);

            watch(getAudioInfo, (now) => {
                lrc = ''; //检测到变化歌词清空
                top.value = 0; //置顶
                on.value = 0;
                nextTick(() => {
                    setTimeout(() => {
                        let audioDom = audio.value !== null ? audio.value : document.getElementById('audio');
                        audioDom.oncanplay = function() {
                            audioDom.play();
                            playing.value = true;
                            openTimer();
                        }

                        //时长相关初始化
                        timeStamp.start = 0;
                        timeStamp.end = audioDom.duration;
                        timeStamp.angle = 0;
                    }, 0)
                })
            })

            watch(getAudioHistory, (now) => {
                // console.log(now);
                songIdx = computedSongIdx();
            })

            return {
                audio,
                playAndPause,
                playing,
                // audioObj,
                show,
                onEnd,
                getAudioInfo,
                showPlayWarp,
                alertPlayBox,
                lrcArr,
                onTimeUpdate,
                top,
                on,
                onProgressChange,
                progress,
                ...toRefs(timeStamp),
                timeFormat,
                cutSong,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
    @import './playBar.scss';
</style>