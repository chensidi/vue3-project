<template>
    <nav class="nav">
        <router-link to="/">
            推荐
        </router-link>
        <router-link to="/about">
            歌手
        </router-link>
        <router-link to="/sort">
            排行榜
        </router-link>
        <router-link to="/search">
            搜索
        </router-link>
    </nav>
</template>

<script>
    export default {
        name: 'SwitchPannel'
    }
</script>

<style lang="scss" scoped>
    .nav{
        height: 2rem;
        line-height: 2rem;
        display: flex;
        a{
            flex-grow: 1;
            text-align: center;
            color: #666;
            font-size: .7rem;
            text-decoration: none;
        }
        .router-link-active{
            color: #31c27c;
            border-bottom: 2px solid #31c27c;
        }
    }
</style>