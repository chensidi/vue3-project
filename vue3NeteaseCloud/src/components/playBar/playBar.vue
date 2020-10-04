<template>
    <div class="play-bar" v-if="getAudioInfo.url">
        <div class="play-bottom" @click="alertPlayBox">
            <div class="pl-lf">
                <img class="play-poster" :src="getAudioInfo.poster" alt="">
                <div class="play-info">
                    <h4>{{ getAudioInfo.song }}</h4>
                    <p>{{ getAudioInfo.singer }}</p>
                </div>
            </div>
            <div class="play-cpn">
                <van-icon @click.stop="playAndPause" size="30px" color="#333" :name="!playing?'play-circle-o':'pause-circle-o'" />
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
                        <img :src="getAudioInfo.poster" alt="">
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
        </div>
    </div>
</template>

<script>
    import { Icon, Loading } from 'vant';
    import { ref, reactive, watch, computed, nextTick } from 'vue';
    import { useStore } from 'vuex';
    import { getLrc } from '@/api/search.js';
    import { loading, loaded } from '@/tools/common.js';

    export default {
        name: 'PlayBar',
        components: {
            'van-icon': Icon
        },
        setup(props, ctx) {
            const store = useStore();
            const audio = ref(null); //音频ref
            const playing = ref(false);
            // let audioObj = reactive(store.getters.getAudioInfo);
            // console.log(store.getters.getAudioInfo)
            const show = ref(false);
            const showPlayWarp = ref(false);
            let lrc = '';
            const lrcArr = ref([]);
            const top = ref(0);
            const on = ref(0);
            // if(audioObj.url) {
            //     show.value = true;
            // }
            function playAndPause() { //播放&暂停
                let audioDom = audio.value;
                if(audioDom.paused) {
                    audioDom.play();
                    playing.value = true;
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
                let curTime = Math.round(audioDom.currentTime);
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
                        }
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
    }
    .play-pannel{
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        z-index: 999;
        background: #fff;
        transform: translate3d(0, 100%, 0);
        transition: all .3s;
    }
    .show-pannel{
        transform: translate3d(0, 0, 0);
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
        filter: blur(1.5px);
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
</style>