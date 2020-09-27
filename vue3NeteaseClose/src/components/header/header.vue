<template>
    <header class="top_operation_bar">
        <div class="bar-l">
            <img class="logo" src="https://y.qq.com/mediastyle/mod/mobile/img/logo.svg" alt="">
            <div>
                <h4 class="title">QQ音乐</h4>
                <p class="header-tips">打开APP收藏下载</p>
            </div>
        </div>
        <div class="bar-r" @click.stop="alertTip">下载APP</div>
    </header>
</template>

<script>
    import { Dialog } from 'vant';
    import { ref } from 'vue';
    export default {
        name: 'Header',
        components: {
            'van-dialog': Dialog.Component
        },
        setup() {

            function alertTip() {
                Dialog.alert({
                    title: '提示',
                    message: '敬请等待迪爷开发',
                    className: 'Jacky_dialog'
                })
            }

            return {
                alertTip
            }
        }
    }
</script>

<style lang="scss" scoped>
    @mixin flex-b{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .top_operation_bar{
        // position: fixed;
        // top: 0;
        // left: 0;
        width: 100vw;
        height: 2.7rem;
        padding: 0 .7rem 0 .8rem;
        z-index: 100;
        box-shadow: 0 3px 25px rgba(0,0,0,.05);
        background-color: #fafafa;
        @include flex-b;
    }
    .Jacky_dialog{
        width: 320px;
        /deep/ {
            .van-dialog__confirm{
                color: #ff5e32;
            }
        }
    }
    .bar-l{
       @include flex-b; 
    }
    .logo{
        width: 1.25rem;
        height: 1.25rem;
        margin-right: .3rem;
    }
    .title{
        font-size: .8rem;
        color: #000;
        font-weight: 400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .header-tips{
        font-size: .6rem;
        color: grey;
    }
    .bar-r{
        display: block;
        height: 1.25rem;
        line-height: 1.25rem;
        padding: 0 .85rem;
        text-align: center;
        font-size: .65rem;
        color: #575656;
        border: solid 1px #d8d8d8;
        border-radius: 999px;
    }
    
</style>