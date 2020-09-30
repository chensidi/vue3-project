<template>
    <section class="mui_tit">
        <h2 class="mod-title">{{title}}</h2>
        <a class="mod-more" href="javascript:;">更多
            <van-icon name="arrow" />
        </a>
    </section>
</template>

<script>
    import { Icon } from 'vant';

    export default {
        name: 'ModTitle',
        props: {
            title: String
        },
        components: {
            'van-icon': Icon
        },
        setup() {
            
        }
    }
</script>

<style lang="scss" scoped>
    @mixin flex($x,$y){
        display: flex;
        align-items: $x;
        justify-content: $y;
    }
    @mixin elpnum($num:1){
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: $num;
        white-space: normal;
        word-wrap: break-word;
        word-break: normal;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .elp{
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: wrap;
        @include elpnum(2);
    }
    .mui_tit {
        position: relative;
        @include flex(center,space-between);
        height: 1.5rem;
        margin: 1rem .8rem .5rem;
        .mod-title{
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: .9rem;
            font-weight: 700;
        }
        .mod-more{
            height: 1rem;
            font-size: 13px;
            font-weight: 300;
            color: rgba(26,26,26,.5);
            @include flex(center,flex-start);
        }
    }
</style>