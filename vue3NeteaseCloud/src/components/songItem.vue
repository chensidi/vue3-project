<template>
    <div class="list-item">
        <div class="f-bd f-bd-btm">
            <div class="item-main">
                <p class="song-name">
                    {{ song }}
                </p>
                <p class="song-info">
                    {{ info }}
                </p>
            </div>
            <div class="item-icon">
                <van-icon name="play-circle-o" />
            </div>
        </div>
    </div>
</template>

<script>
    import { Icon, } from 'vant';
    export default {
        name: 'PlayItem',
        props: {
            song: String,
            info: String,
        },
        components: {
            'van-icon': Icon,
        },
        setup(props) {
            let {
                song, info
            } = props;

            return {
                song, 
                info,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/style.scss';
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

</style>