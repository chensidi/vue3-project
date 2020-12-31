<template>
    <div class="big-mv">
        <div class="img-wrap">
            <img v-lazy="info.cover" alt="">
            <div class="datas">
                <span class="play-count"><van-icon name="play" />{{ numFormat(info.playCount) }}</span>
            </div>
            <div class="mask">
                <van-icon name="play" class="playbar" />
            </div>
        </div>
        <div class="mv-footer">
            {{ info.name }}
        </div>
    </div>
</template>

<script>
import { Icon } from 'vant';
import { numFormat } from '@/tools/common.js';
export default {
    name: 'OneMv',
    components: {
        'van-icon': Icon,
    },
    props: {
        mvInfo: {
            type: Object,
            default: function() {
                return {}
            }
        },
        func: {
            type: Function
        }
    },
    setup(props) {

        let info = props.mvInfo;
        return {
            info,
            numFormat
        }
    }
}
</script>

<style lang="scss" scoped>
     .big-mv{
        width: 100%;
        margin-bottom: 10px;
        .img-wrap{
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 50%;
            background: rgba(0,0,0, .4);
            border-radius: 4px;
            img{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                object-fit: cover;
                border-radius: 4px;
            }
            .datas{
                display: flex;
                justify-content: space-between;
                color: #fff;
                font-size: 12px;
                position: absolute;
                bottom: 5px;
                left: 10px;
                z-index: 1;
            }
        }
        .mv-footer{
            color: #333;
            font-size: 13px;
            margin-top: 13px;
        }
        .mask{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            display: flex;
            border-radius: 4px;
            background: linear-gradient(rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%);
        }
        .playbar{
            margin: auto;
            color: rgba(255,255,255,.8);
            font-size: 30px;
            margin: auto;
        }
    }
</style>