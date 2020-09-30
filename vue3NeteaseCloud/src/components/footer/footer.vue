<template>
    <footer class="copyright">
        <div class="copyright__media">
            <img class="copyright__logo" src="https://y.qq.com/mediastyle/mod/mobile/img/logo_ch.svg" alt="QQ音乐">
        </div>
        <p class="copyright__para">Copyright © 1998 - <span>2019</span> Tencent. All Rights Reserved.</p>
        <p class="copyright__para">联系电话：0755-86013388 QQ群：55209235</p>
    </footer>
</template>

<script>
    export default {
        name: 'Footer'
    }
</script>

<style lang="scss" scoped>
    @mixin flex-b{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .copyright {
        margin-top: 1.5rem;
        padding: .8rem 0;
        text-align: center;
        font-size: 12px;
        color: rgba(26,26,26,1);
    }
    .copyright__media {
        width: 4rem;
        height: 1.1rem;
        margin: 0 auto .5rem;
        img{
            width: 100%;
        }
    }
</style>