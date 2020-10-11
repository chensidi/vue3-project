<template>
    <div class="guanfang">
        <div class="guanfang-item" v-for="(item) of list" :key="item.id">
            <div class="sort-items">
                <div class="sort-item">
                    <img class="sort-logo" src="http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg" :data-src="item.coverImgUrl" alt="">
                    <p class="updata-time">{{item.updateFrequency}}</p>
                </div>
            </div>
            <div class="track">
                <p v-for="(items, i) of item.tracks" :key="items.first">{{i+1}}. {{trackFormat(items)}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list: Array
        },
        name: 'TrackPannel',
        setup() {
            function trackFormat(trackObj) {
                return `${trackObj.first} - ${trackObj.second}`
            }

            return {
                trackFormat
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
    
    .sort-logo{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
    }
    .sort-items{
        width: 30%;
    }
    .sort-item{
        height: 0;
        padding-bottom: 100%;
        position: relative;
    }
    
    .updata-time{
        font-size: .6rem;
        position: absolute;
        bottom: 0;
        color: #fff;
        padding: .3rem .3rem;
    }

    
    .guanfang-item{
        @include flex(center, space-between);
        margin: .5rem 0;
    }
    .track{
        flex: 1;
        overflow: hidden;
        padding: {
            left: .8rem;
        }
        p{
            font-size: .65rem;
            line-height: 2.5;
            @include elp;
        }
    }
</style>