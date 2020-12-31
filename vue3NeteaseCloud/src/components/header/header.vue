<template>
    <header class="top_operation_bar">
        <div class="bar-l">
            <img class="logo" src="https://y.qq.com/mediastyle/mod/mobile/img/logo.svg" alt="">
            <div>
                <h4 class="title">Jacky Music</h4>
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
    @import './header.scss';
</style>