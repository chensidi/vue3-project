<template>
    <div class="mv-block" @click.stop="handler">
        <div class="mv-img">
            <img :src="item.cover || item.picUrl" alt="">
            <span class="play-count">
                <van-icon name="play" />{{ numFormat(item.playCount) }}
            </span>
        </div>
        <div class="mv-intr">
            <h5 class="mv-title van-ellipsis">{{ item.name }}</h5>
            <p class="mv-art van-ellipsis">{{ item.artistName }}</p>
        </div>
    </div>
</template>

<script>
import { Icon } from 'vant';
import { reactive } from 'vue';
import { numFormat } from '@/tools/common.js';
export default {
    name: 'MvBlock',
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
    components: {
        'van-icon': Icon
    },
    setup(props, { emit }) {
        const item = reactive(props.mvInfo);

        function handler() {
            props.func(item);
        }

        return {
            item,
            numFormat,
            handler
        }
    }
}
</script>

<style lang="scss" scoped>
    .mv-block{
        width: 49%;
        margin: 0px 0 10px;
        .mv-img{
            position: relative;
            img{
                width: 100%;
                border-radius: 4px;
            }
        }
        .play-count{
            color: #fff;
            position: absolute;
            font-size: 12px;
            right: 5px;
            top: 5px;
        }
        .mv-intr{
            .mv-title{
                font-size: 13px;
                color: #333;
                font-weight: normal;
            }
            .mv-art{
                font-size: 12px;
                color: #888;
            }
        }
    }
</style>