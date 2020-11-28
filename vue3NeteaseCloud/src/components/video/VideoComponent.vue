<template>
    <div :class="['video-player', show ? '' : 'hide']" @click.stop="playPauseVideo">
        <van-icon name="arrow-left" class="back" @click.stop="hide" />
        <video 
            :src="src"
            :poster="poster"
            preload="auto"
            ref="videoDOM"
            @timeupdate="timeUpdate"
        >
        </video>
        <transition name="fade">
            <van-icon v-show="!key" name="play" class="video-playbar" />
        </transition>
        <div class="playbar" @click.stop>
            <time>{{ timeStampFormat(curTime) }}</time>
            <van-slider v-model="curPc" @change="onChange" />
            <time>{{ timeStampFormat(duration) }}</time>
            <div class="changeQuality" @click.stop="showChooseQuality = !showChooseQuality">
                {{ curQuality + 'P' }}
                <div class="choose-area" v-show="showChooseQuality">
                    <p @click.stop="goChooseQuality(p)" v-for="p of qualitys" :key="p">{{ p + 'P' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon, Slider } from 'vant';
import { reactive, toRefs, ref, nextTick, computed, watch, } from 'vue';
import { timeStampFormat } from '@/tools/common.js';
import { 
    getMVUrl, 
    } from '@/api/singer';
    import { loading, loaded } from '@/tools/common.js';
export default {
    name: 'VideoComponent',
    components: {
        'van-icon': Icon,
        'van-slider': Slider
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        videoInfo: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, { emit }) {
        const videoObj = reactive({
            id: '',
            src: 'http://vodkgeyttp8.vod.126.net/cloudmusic/ICEiMDFgICAxMCBgJWEwOA==/mv/382191/e36cbb4095bdb74bab9528fe833d9fde.mp4?wsSecret=65854f1bc833230edef89784ca0a7eac&wsTime=1605959182',
            poster: 'http://p1.music.126.net/H7_L1aRDFWit8VeMJ23hbQ==/7715273092234794.jpg',
            duration: 0,
            curTime: 0,
            curPc: 0,
            key: false,
            qualitys: [
            ]
        });


        const showChooseQuality = ref(false);
        const curQuality = ref('');

        const videoDOM = ref(null);

        const show = computed(() => props.modelValue);

        const videoInfo = computed(() => props.videoInfo.src);

        watch(videoInfo, (now) => {
            videoObj.src = now;
            videoObj.poster = props.videoInfo.poster;
            videoObj.qualitys = props.videoInfo.qualitys;
            videoObj.id = props.videoInfo.id;
            curQuality.value = videoObj.qualitys[0];
            videoObj.duration = 0;
            videoObj.curPc = 0;
            videoObj.curTime = 0;
        })

        function onChange(val) {
            videoDOM.value.currentTime = val / 100 * videoDOM.value.duration;
            videoObj.curTime = Math.round(videoDOM.value.currentTime);
        }
        
        function playPauseVideo() {
            if(videoDOM.value.paused) {
                videoDOM.value.play();
                videoObj.key = true;
            }else {
                videoDOM.value.pause();
                videoObj.key = false;
            }
            showChooseQuality.value = false;
        }

        function timeUpdate() {
            let duration = videoDOM.value.duration;
            let curTime = videoDOM.value.currentTime;
            curTime = Math.round(curTime);
            let curPc = (videoDOM.value.currentTime / duration) * 100;
            curPc = parseInt(curPc);
            videoObj.duration = Math.round(duration);
            videoObj.curTime = curTime;
            videoObj.curPc = curPc;
        }

        function goChooseQuality(p) {
            if(p != curQuality.value) {
                curQuality.value = p;
                changeBrs(p);
            }
            showChooseQuality.value = false;
        }

        nextTick(() => {
            // console.log(videoDOM.value.duration)
            curQuality.value = videoObj.qualitys[0];
        })

        function hide() {
            emit('update:modelValue', false);
            videoDOM.value.pause();
            videoObj.key = false;
        }

        async function changeBrs(br) { //分辨率切换

            loading();
            let url = await getMVUrl(videoObj.id, br);
            videoObj.src = url;
            let currentTime = videoDOM.value.currentTime;
            nextTick(() => {
                setTimeout(() => {
                    loaded();
                    videoDOM.value.currentTime = currentTime;
                    if(videoObj.key) {
                        videoDOM.value.play();
                        videoObj.key = true;
                    }else {
                        videoDOM.value.pause();
                        videoObj.key = false;
                    }
                    showChooseQuality.value = false;
                }, 1000)
            })
        }

        watch(show, (now) => {
            console.log(now);
            playPauseVideo();
        })

        return {
            ...toRefs(videoObj),
            videoDOM,
            onChange,
            playPauseVideo,
            timeUpdate,
            timeStampFormat,
            showChooseQuality,
            goChooseQuality,
            curQuality,
            hide,
            show,
        }
    }
}
</script>

<style scoped lang="scss">
    .video-player{
        position: fixed;
        background: #000;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 999;
        overflow: hidden;
        video{
            object-fit: fill;
            position: absolute;
            width: 100%;
            left: 0;
            right: 0;
            top: 50%;
            transform: translate3d(0, -50%, 0);
        }
        transition: all .3s;
        &.hide{
            transform: translateX(100%);
        }
    }
    .video-playbar{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        z-index: 9999;
        color: #fff;
        font-size: 50px;
    }
    .playbar{
        position: absolute;
        bottom: 3%;
        left: 0;
        width: 100%;
        display: flex;
        padding: 0 65px 0 15px;
        align-items: center;
        time{
            font-size: 13px;
            color: #fff;
        }
        .changeQuality{
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translate3d(0, -50%, 0);
            color: #fff;
            font-size: 12px;
            padding: 3px 5px;
            width: 48px;
            text-align: center;
            border: 1px solid #fff;
            border-radius: 2px;
        }
    }
    /deep/ .van-slider__button{
        width: 12px;
        height: 12px;
    }
    /deep/ .van-slider{
        height: 1px;
        margin: 0 10px;
    }
    .fade-enter-from, .fade-leave-to{
        opacity: 0;
        transition: all .1s;
    }
    .fade-enter-active, .fade-leave-active{
        opacity: .5;
        // transition: all .1s;
    }
    .choose-area{
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        transform: translateY(-100%);
        background: rgba($color: #fff, $alpha: .2);
        padding: 5px 0;
        border-radius: 2px 2px 0 0;
        p{
            color: #fff;
            font-size: 12px;
            text-align: center;
            padding: 5px 0;
        }
    }
    .back{
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1;
        color: #fff;
        font-size: 20px;
    }
</style>