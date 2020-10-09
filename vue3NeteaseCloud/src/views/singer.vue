<template>
	<div class="box-wrap">
		<van-index-bar sticky @select="onSelect">
			<template v-for="(item, i) of list" :key="item">
				<van-index-anchor :index="item" />
				<p v-for="(obj) of singerList[i]" :key="obj.id" class="singer-item">
					<img class="singer-head" :data-src="obj.picUrl" alt="" sec="https://img.yzcdn.cn/vant/apple-1.jpg">
					<span>{{ obj.name }}</span>
				</p>
			</template>
		</van-index-bar>
	</div>
</template>

<script>
	import { IndexBar, IndexAnchor, Cell, } from 'vant';
	import { ref, reactive, toRefs, onMounted } from 'vue';
	import { getSingerList } from '@/api/singer.js';
	
	export default {
		name: 'Singer',
		components: {
			'van-index-anchor': IndexAnchor,
			'van-index-bar': IndexBar,
			'van-cell': Cell
		},
		setup() {
			
			const singerObj = reactive({
				list: [],
				singerList: []
			})

			let num = 0, height, barH;

			function createList() {
				for(let i = 65; i < 91; i ++) {
					let item = String.fromCharCode(i);
					singerObj.list.push(item);
					getSingerList(-1, -1, item).then((res) => {
						singerObj.singerList[i-65] = res;
					})
					computedLazy();
				}
			}

			function onSelect(val) {
				console.log(val);
			}

			function onScrll() { //滚动监听
				document.getElementsByClassName('box-wrap')[0].addEventListener('scroll', debounce(computedLazy, 500)) 
			}

			function debounce(func, wait) {
				let timeout;
				return function () {
					let context = this;
					let args = arguments;

					if (timeout) clearTimeout(timeout);
					
					timeout = setTimeout(() => {
						func.apply(context, args)
					}, wait);
				}
			}

			function computedLazy() { //计算懒加载
				let oImgs = document.getElementsByClassName('singer-head');
				// console.log(oImgs);
				for(let i = num; i < oImgs.length; i ++) {
					let oTop = oImgs[i].offsetTop,
						oScroll = document.getElementsByClassName('box-wrap')[0].scrollTop;

					if(oTop < oScroll + height + barH) {
						let src = oImgs[i].getAttribute('data-src');
						oImgs[i].setAttribute('src', src);
						oImgs[i].removeAttribute('data-src');
						num = i;
					}else {
						break;
					}
				}
			}

			createList();

			onMounted(() => {
				onScrll();
				height = document.getElementsByClassName('box-wrap')[0].offsetHeight;
				barH = document.getElementsByClassName('play-bar')[0].offsetHeight;
			})

			return {
				...toRefs(singerObj),
				onSelect,
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/assets/style.scss';
	.singer-item{
		@include flex(center, flex-start);
		padding: 10px 10px;
	}
	.singer-head{
		display: inline-block;
		width: 50px;
		height: 50px;
		margin-right: 15px;
		border-radius: 50%;
	}
</style>