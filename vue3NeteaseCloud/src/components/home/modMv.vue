<template>
  <section class="mod-item">
    <ul class="mod-list horizontal tit_wrap">
      <li v-for="item of list" :key="item.id">
        <div class="mod-img">
          <img :src="item.cover" alt="" />
          <span class="listen-count">
            <van-icon name="play" />{{ numFormat(item.playCount) }}
          </span>
        </div>
        <p class="elp">{{ item.name }}</p>
      </li>
    </ul>
  </section>
</template>

<script>
import { Icon } from "vant";
import { numFormat } from '@/tools/common.js';

export default {
  name: "ModMv",
  props: {
    title: String,
    list: Array,
  },
  components: {
    "van-icon": Icon,
  },
  setup() {
        return {
            numFormat
        }
  },
};
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
        @include elpnum(2);
    }
    .mod-list {
        margin: 0 .6rem;
        font-size: 0;
        margin-right: 0;
        white-space: nowrap;
        .mod-img{
            position: relative;
            width: 11.3rem;
            height: 0;
            padding-bottom: 5.45rem;
            >img{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: .4rem;
            }
        }
        >li{
            margin: 0 .2rem;
            vertical-align: top;
            display: inline-block;
            p{
                color: rgba(26,26,26,1);
                font-size: .65rem;
                margin-top: .4rem;
                max-width: 11.3rem;
            }
        }
    }
    
    .mod-item{
        margin-bottom: -.5rem;
        padding: .5rem 0;
        overflow-x: auto;
        overflow-y: hidden;
        
    }
    .mod-item::-webkit-scrollbar{
        display: none;
    }
    .listen-count{
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 5;
        @include flex(center, flex-start);
        height: 17px;
        min-width: 14px;
        padding: 0 7px;
        border-radius: 9px;
        background: rgba(0,0,0,.4);
        font-size: 12px;
        color: #fff;
    }
</style>