<template>
    <div class="play-bar" v-if="show">
        <div class="play-bottom">
            <div class="pl-lf">
                <img class="play-poster" :src="audioObj?audioObj.poster:''" alt="">
                <div class="play-info">
                    <h4>{{ audioObj?audioObj.song:'' }}</h4>
                    <p>{{ audioObj?audioObj.singer:'' }}</p>
                </div>
            </div>
            <div class="play-cpn">
                <van-icon @click.stop="playAndPause" size="30px" color="#333" :name="!playing?'play-circle-o':'pause-circle-o'" />
            </div>
        </div>
        <audio ref="audio" id="audio" :src="audioObj?audioObj.url:''"  @ended="onEnd"></audio>
    </div>
</template>

<script>
    import { Icon } from 'vant';
    import { ref, reactive, watch, computed, nextTick } from 'vue';
    import { useStore } from 'vuex';

    export default {
        name: 'PlayBar',
        components: {
            'van-icon': Icon
        },
        setup(props, ctx) {
            const store = useStore();
            const audio = ref(null); //音频ref
            const playing = ref(false);
            let audioObj = reactive(store.getters.getAudioInfo);
            console.log(store.getters.getAudioInfo)
            const show = ref(false);
            if(audioObj.url) {
                show.value = true;
            }
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

            let getAudioInfo = computed(() => store.getters.getAudioInfo);

            watch(getAudioInfo, (now) => {
                audioObj = Object.assign(audioObj, {...now});
                nextTick(() => {
                    show.value = true;
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
                audioObj,
                show,
                onEnd,
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
</style>