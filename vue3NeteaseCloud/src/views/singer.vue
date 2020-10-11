<template>
	<div class="box-wrap">
		<!-- <van-index-bar sticky @select="onSelect">
			<template v-for="(item, i) of list" :key="item">
				<van-index-anchor :index="item" />
				<p v-for="(obj) of singerList[i]" :key="obj.id" class="singer-item">
					<img class="singer-head" :data-src="obj.picUrl" alt="" src="https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg">
					<span>{{ obj.name }}</span>
				</p>
			</template>
		</van-index-bar> -->
		<van-list
			v-model:loading="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<template v-for="(item, i) of singerList" :key="i">
				<p class="singer-item" v-for="(obj) of item" :key="obj.id">
					<img class="singer-head" :data-src="obj.picUrl" alt="" src="https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg">
					<span>{{ obj.name }}</span>
				</p>
			</template>
		</van-list>
	</div>
</template>

<script>
	import { IndexBar, IndexAnchor, Cell, List, } from 'vant';
	import { ref, reactive, toRefs, onMounted, watch, nextTick } from 'vue';
	import { getSingerList } from '@/api/singer.js';
	import { lazyLoadImg } from '@/tools/common.js';
	
	export default {
		name: 'Singer',
		components: {
			'van-index-anchor': IndexAnchor,
			'van-index-bar': IndexBar,
			'van-cell': Cell,
			'van-list': List,
		},
		setup() {
			let num = 0, height, barH;
			
			const singerObj = reactive({
				list: [],
				singerList: []
			})

			const loadObj = reactive({
				loading: false,
				finished: false,
			})

			async function onLoad() {
				if(num > 26) {
					loadObj.finished = true;
					return;
				}
				let item = String.fromCharCode(num + 65);
				let res = await getSingerList(-1, -1, item);
				singerObj.singerList.push(res);
				loadObj.loading = false;
				nextTick(() => {
					let singerHeads = document.getElementsByClassName('singer-head');
					singerHeads = Array.from(singerHeads).slice(num*10, num*10 + 10);
					singerHeads.forEach(item => {
						lazyLoadImg(item, {
							root: document.getElementsByClassName('box-wrap')[0],
							threshold: 0,
							rootMargin: '0px 0px 0px 0px'
						})
					})
					num ++;
				})
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

			return {
				...toRefs(singerObj),
				...toRefs(loadObj),
				onLoad,
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