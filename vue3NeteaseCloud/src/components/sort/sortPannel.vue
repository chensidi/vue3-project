<template>
    <div class="sort-list">
        <div class="sort-items" v-for="(item) of list" :key="item.id">
            <div class="sort-item" @click.stop="goDetails(item)">
                <img class="sort-logo" src="../../assets/cover.png" :data-src="item.coverImgUrl" alt="">
                <p class="updata-time">{{item.updateFrequency}}</p>
            </div>
            <p class="sortname">{{item.name}}</p>
        </div>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router';
    export default {
        props: {
            list: Array
        },
        name: 'SortPannel',
        setup() {
            const router = useRouter();

            function goDetails(item) {
                router.push({
                    name: 'SortDetails',
                    query: {
                        id: item.id,
                        name: item.name,
                    }
                })
            }

            return {
                goDetails
            }
        }
    }
</script>

<style lang="scss" scoped>
    @mixin flex($x: center, $y: space-between){
        display: flex;
        align-items: $x;
        justify-content: $y;
        flex-wrap: wrap;
    }
    @mixin elp{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sort-list{
        @include flex(flex-start, flex-start);
        margin: {
            bottom: 1rem;
            right: -3%;
        }
    }
    .updata-time{
        font-size: .6rem;
        position: absolute;
        bottom: 0;
        color: #fff;
        padding: .3rem .3rem;
    }

    .sort-items{
        width: 30%;
        margin-right: 3.3333%;
    }
    .sort-item{
        height: 0;
        padding-bottom: 100%;
        position: relative;
    }
    .sortname{
        line-height: 1.5;
        font-size: .7rem;
        margin: .25rem 0;
    }
    .sort-logo{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
    }
</style>