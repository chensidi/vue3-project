<template>
  <section  class="mod-item">
    <ul class="mod-list tit_wrap">
      <li v-for="item of list" :key="item.id" @click.stop="to(item)">
        <div class="mod-img">
          <img :src="item.picUrl || item.coverImgUrl" alt="" />
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
import { numFormat } from "@/tools/common.js";
import { nextTick, onMounted, watch, ref } from 'vue';
import * as mui from '@/assets/mui/js/mui.min.js';

export default {
  name: "ModSection",
  props: {
    title: String,
    list: Array,
    func: Function,
  },
  components: {
    "van-icon": Icon,
  },
  setup(props, ctx) {
    function to(item) {
      props.func(item);
    }

    const h = ref(0);
    
    // onMounted(() => {
    //   mui('.mui-scroll-wrapper').scroll({
    //     deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    //   });
    // })

    // watch(props, (now) => {
    //   nextTick(() => {
    //     let list = document.querySelector('.mod-list li');
    //     h.value = list.getBoundingClientRect().height
    //   })
    // })

    return {
      numFormat,
      to,
      h,
    };
  },
};
</script>


<style scoped>
  /* @import '../../assets/mui/css/mui.min.css'; */
</style>
<style lang="scss" scoped>
@mixin flex($x, $y) {
  display: flex;
  align-items: $x;
  justify-content: $y;
}
@mixin elpnum($num: 1) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $num;
  white-space: normal;
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.elp {
  @include elpnum(2);
}
.mod-list {
  margin: 0 0.6rem;
  font-size: 0;
  margin-right: 0;
  white-space: nowrap;
  .mod-img {
    position: relative;
    width: 5.45rem;
    height: 0;
    padding-bottom: 5.45rem;
    > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.4rem;
    }
  }
  > li {
    margin: 0 0.2rem;
    vertical-align: top;
    display: inline-block;
    p {
      color: rgba(26, 26, 26, 1);
      font-size: 0.65rem;
      margin-top: 0.4rem;
      max-width: 5.45rem;
    }
  }
}

.mod-item {
  margin-bottom: -0.5rem;
  padding: 0.5rem 0;
  overflow-x: auto;
  overflow-y: hidden;
}
.mod-item::-webkit-scrollbar {
  display: none;
}
.listen-count {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 5;
  @include flex(center, flex-start);
  height: 17px;
  min-width: 14px;
  padding: 0 7px;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  color: #fff;
}
</style>