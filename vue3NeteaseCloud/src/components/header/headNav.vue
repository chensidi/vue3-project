<template>
    <div class="page-header"
    :style="{'background-image': 'url('+ pic +')'}"
    >
        <van-icon name="arrow-left" @click.stop="back" />
        <h3 class="title">{{ title }}</h3>
    </div>
</template>

<script>
    import { Icon } from 'vant';

    export default {
        name: 'HeadNav',
        props: {
            pic: String,
            fun: Function,
            title: String
        },
        components: {
            'van-icon': Icon
        },
        setup(props) {
            let {
                pic,
                fun,
                title,
            } = props;

            function back() {
                fun();
            }

            return {
                pic,
                back,
                title
            }
        }
    }
</script>

<style lang="scss" scoped>
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
        background-image: url(../../assets/cover.png);
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
</style>