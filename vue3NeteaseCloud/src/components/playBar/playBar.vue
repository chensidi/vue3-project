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
                    <div class="m-song-plybtn" @click.stop="playAndPause" v-show="!playing"></div>
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
            </div>
        </div>
    </div>
</template>

<script>
    import { Icon, Slider, } from 'vant';
    import { ref, reactive, watch, computed, nextTick, toRefs, } from 'vue';
    import { useStore } from 'vuex';
    import { getLrc } from '@/api/search.js';
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
                    split2.push({
                        time,
                        txt: temp[1]
                    })
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


            let getAudioInfo = computed(() => store.getters.getAudioInfo);

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
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
    .play-bar{
        position: fixed;
        bottom: 0;
        width: 100vw;
        height: 50px;
        left: 0;
        z-index: 99;
        background: #fff;
        border: {
            top: 1px solid #eee;
        }
    }
    .play-bottom{
        padding: 5px 10px;
        @include flex;
    }

    .play-poster{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 5px;
    }
    .play-info{
        overflow: hidden;
        h4{
            font-size: 14px;
            font-weight: normal;
            color: #333;
            @include elp;
        }
        p{
            font-size: 12px;
            color: #aaa;
            @include elp;
        }
    }
    .pl-lf{
        @include flex(center, flex-start);
        flex: 1;
        overflow: hidden;
    }
    .play-pannel{
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        z-index: 999;
        background: #fff;
        transform: translate3d(0, 102%, 0);
        transition: all .3s;
    }
    .show-pannel{
        transform: translate3d(0, -2%, 0);
    }
    .play-bg{
        position: absolute;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        background-color: #161824;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: auto 100%;
        transform: scale(1.5);
        transform-origin: center top;
        overflow: hidden;
        transition: opacity .3s linear;
        opacity: 1;
        filter: blur(2.5px);
        &::before{
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background-color: rgba(0,0,0,.5);
        }
    }

    .play-wrap{
        padding-top: 70px;
    }

    .m-song-disc{
        width: 78vw;
        height: 78vw;
        margin: 0 auto;
        position: relative;
        border-radius: 50%;
        overflow: hidden;
    }
    .m-song-turn{
        border-radius: 50%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2;
        background: url(https://s3.music.126.net/mobile-new/img/disc.png?d3bdd1080a72129346aa0b4b4964b75f=) no-repeat;
        background-size: contain;
    }
    .m-song-img {
        width: 184px;
        height: 184px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -92px 0 0 -92px;
        >img{
            width: 100%;
            border-radius: 50%;
            transition: all .1s;
        }
    }

    .m-song-plybtn {
        position: absolute;
        width: 50px;
        height: 50px;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 10;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAABJlBMVEUAAAAAAAD////l5eX///9iYmKDg4Pn5+f///9YWFj////09PT////4+Pjt7e3///////9oaGhBQUH////////////////CwsIaGhr///8xMTEkJCT////7+/vp6en///////////////+srKyoqKienp58fHz////y8vKTk5P///8EBAT////////////////V1dW3t7f////////////////////v7++jo6N9fX3///////+UlJT////s7Oz////Nzc3///////+RkZGPj495eXkTExP////////29vb////k5OTPz882Njb////////////c3Nz///////9ycnJsbGz///9dXV3////////Q0ND///9QUFD///////////////////9FeiN6AAAAYXRSTlNmAP3c+oWT3ueB9vA19ealRId5EQbuurpu83RxD/nh05dfAquooo+M7JtzaSolE+vMspJ3Wj7w6KSQj6ucKeXNxLWnmpmObVYd8t3axXZRSt7TvbKLideCeSzHnn4V3Nh6YarbPAAABlRJREFUeNrU14lWEmEYh/GXcdj3HQTZRCkS913UNE2zbLd9Oc/930Q2LmVpwPAC03MD/M5835n/IC6dkqHnzcVoZvdkLp2HfHruZDcTXWw+DyVdOilAt6uNjI8782Ua1W2XjTShtdDSmzRdlH6zFKq5bKQBTS5H57gqXJrP1tsb7kShkBPJFQoJ90a7np0vhblqLrrc8R7oQ4vVPZOLIp8mp8flzsanJ59FuMjcqxZdHVKFxvYDWK1lPQXpooInu4ZVYD/m6pAWNLn0DSvvekJ6KLHuxerb0qyrQwrQViV/oZzKSc/lpi6sgUrLdSN16MyWARBcOBWbnS4EAYytj67r1KGtqMUseaSvPCWLGr14u+pDZysmwFhc+i4+BmBWZgcATTXTFvO9qOS3qOlmShu68g7A6xa13F6A7yuq0ORnA9jZENU2dgDjc1IPGvMB4QNR7+AJ4IspQVObBjDmF+Wur6qxmdKAbpeBoEcGlCcIlLf7hx7lOzxOlYeaP+oTmmoYQFsGWhswGql+oMUMEInLgItHgEzRPvS43OHYVY+/fGwXGvIBkzKU6oAvZA8aywOPZEg9AvIxO9AXAZg4lKF1OAGBF71DX5jw5EyG2NkTMJ/3Co2ZcM8tQ819D8xYb9CVgA2nijSw0gs0tArBzk59aRBWQ91Dj30QjssIiofBd9wttFiGiTMZSWcTUC52B629Bg5lRB0Cr2tdQRvAfRlZ94FGN9AjA+oywupgHHWGzuRhTEbaGORnOkFTZYj4ZaT5I1BOdYBuAnEZcXFg89/QmAFtGXltMGL/ghZ9I7+g19fUV/wHtAJBvzggfxAqd0NXDPCII/KAsXIXNPXOIQd/efjvUndAmxB2xMH/zB+G5u3Qr2k4EMd0AOmvt0IrsCMOagcqt0FbJkyLg5oGs3ULNApecVReiP4NnTHALY7KDcbHv6BbDno1XTUGW39CWwa8F4flB6P1B3TRgQ/UeqSLN6GzAQd83f1dHAKzN6AfoCQOrARLN6Andr9GpiITT9/KwPLAye/QGATFTusAxsOCDKogxH6D7sOC2GkNq+B9GVALsP8LWgzAqdjJ4LJXCRlIpxAoXkOrtteT6yYmH8gg8kL1GroHU/1CoTSQBZ6CvSto0oRc/1DM7GNRLwdm8hK6DF5RgMI9j6jnheVLaBTWdaAwPy7KrUP0Alqbg4QWlPCU6JaAuZoFDcGaqEHh6RdRLQIhC/oBsppQzAXVN1UWlixoBjyqUIhozr8H3vyE1lYhpwnVnv8CpH9CZyAi2lAIPtK8pDPn0Cp8UoWqz/8zqJ5DGzCpCdWf/0lonEMzMK0J1Z//acicQ30wrgnVn/9x8LkkCWFRherPfxiSEgKvLlR//r0QkmWY14Xqz/88LEsTsqpQ/fm3RlQWoa4L1Z//OixKFNq6UP35vw9RycDGMKAYD3P9vEhlF9y6UP35d8OuvISELlR//hPwUqxh0oTqz781TbIKueFB4em4rb/Mq5IfMpRn0nOPIS+ADBUatvcz/w/0B/X2VgMACMNQ9AMnWOADKwT/QuahyZYcDcte7e146X9W+vFmWmEzOeOJGfjMCmWOEubMYw7no7wizHPHvMuMAMFIOo5IxsiOjJDLSOOM2cDYN44hxliMjGnL2OAOWMCgGgz84uBEDKDFIG8ORLhzLPO2Y5kK6PpMdJiBsR28nQkMOBEMJtTixISY4JUTZWPCgVXevesgCINhGG7dZPLEIg7GRRsMTsaoMTEOnmLUuBgn+e//JuTHGt0aKT3y3QIFpj6vO9ctnbnAmr9PIysefn0E0PfhkjW92HFtnQHULn5AAG9aISZGF3NaQYxVrInRrcVYBW4H5vkPEPIfuIV5UGXhClHT8Qv9oXQ/MckoTfb+wVTGqK8ZUl9+4mmUnpGj03pOmzlH5y/w5w6ZiAil+G9qA0KpkfWMTxKsJ6530wel3try9CwjSscg27BTDcw321gHjzyuEjj9IbwP1hPeDqHo2abP0pn5XMR/NhTB/fyo2gv3q0gh1JSkEHCrUuMSG1VxCdxDOtfR1ZDr4AGUwIUACi5JJZMyx1RHUgY3kIn0LBuFQk2EFlv7J3t0+id7JPi86wlJsfm9FUVbQrZR1LrPmQ0hKZfSXC7Fzr5LeD7uGoYBQBCGV56PS2g5ewGy+NkUNbjr9gAAAABJRU5ErkJggg==) 0 0 no-repeat;
        background-size: contain;
    }
    .song-lrc{
        padding: 0 35px;
        margin-top: 25px;
        position: relative;
        z-index: 20;
    }
    .m-song-h2{
        text-align: center;
        font-size: 18px;
        line-height: 1.1;
        color: #fefefe;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: normal;
    }
    .m-song-gap {
        margin: 0 4px;
    }
    .m-song-autr {
        font-size: 16px;
        color: hsla(0,0%,100%,.6);
    }
    .lrc-wrap{
        position: relative;
        margin-top: 14px;
    }
    .lrc-scroll{
        font-size: 16px;
        height: 120px;
        overflow: hidden;
        -webkit-mask: -webkit-linear-gradient(top,#000,#000 70%,rgba(0,0,0,0));
    }
    .lrc-box{
        color: hsla(0,0%,100%,.6);
        text-align: center;
        transition: all .3s;
       p{
           line-height: 2;
           &.on{
               color: #fff;
           }
       }
    }
    .play-logo{
        position: absolute;
        top: 18px;
        left: 12px;
        color: #fff;
    }
    .option-area{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        padding: 10px;
        // height: 50px;
        /deep/ .van-slider__button{
            width: 6px;
            height: 6px;
            transform: scaleY(2);
        }
        /deep/ .van-slider{
            height: 1px;
            transform: scaleY(.5);
            width: 82%;
            margin: auto;
            background-color: #aaa;
        }
        /deep/ .van-slider__bar{
            background-color: #fff;
        }
        .time-bar{
            @include flex();
            time{
                color: #fff;
                font-size: 10px;
                transform: scale(0.8);
            }
        }
    }
</style>