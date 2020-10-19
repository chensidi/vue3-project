<template>
	<div class="box-wrap">
		<div class="singer-type">
			<p>
				<span @click.stop="onAreaChange(item, 0)" :class="['type-area', {'on': area == item.area}]" v-for="(item) of areas" :key="item.area">{{ item.txt }}</span>
			</p>
			<p>
				<span @click.stop="onAreaChange(item, 1)" :class="['type-area', {'on': type == item.type}]" v-for="(item) of types" :key="item.type">{{ item.txt }}</span>
			</p>
		</div>
		<div class="list-wrap">
			<van-list
				v-model:loading="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<p @click.stop="to(obj)" class="singer-item" v-for="(obj) of singerList" :key="obj.id">
					<img class="singer-head" :data-src="obj.picUrl" alt="" src="../assets/head.jpg">
					<span class="van-ellipsis">{{ obj.name }} {{ obj.alias.length > 0?'(' + obj.alias[0] + ')':'' }}</span>
				</p>
			</van-list>
		</div>
	</div>
	<!-- <transition name="slide">
		<router-view></router-view>
	</transition> -->
	<!-- <router-view v-slot="{ Component }">
		<transition>
			<component :is="Component" />
		</transition>
	</router-view> -->
	<router-view></router-view>
</template>

<script>
	import { IndexBar, IndexAnchor, Cell, List, } from 'vant';
	import { ref, reactive, toRefs, onMounted, watch, nextTick, onActivated, } from 'vue';
	import { getSingerList } from '@/api/singer.js';
	import { lazyLoadImg } from '@/tools/common.js';
	import { onBeforeRouteLeave, useRouter } from 'vue-router';
	
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
			let scrollTop = 0;

			onActivated(() => {
				document.getElementsByClassName('list-wrap')[0].scrollTo(0, scrollTop);
			})

			onBeforeRouteLeave(() => {
				scrollTop = document.getElementsByClassName('list-wrap')[0].scrollTop;
			})
			
			const singerObj = reactive({
				list: [],
				singerList: []
			})

			const singerList = ref([]);

			const loadObj = reactive({
				loading: false,
				finished: false,
			})

			const typeList = reactive({
				types: [
					{type: 1, txt: '男歌手'},
					{type: 2, txt: '女歌手'},
					{type: 3, txt: '乐队/组合'},
				],
				areas: [
					{area: 7, txt: '华语'},
					{area: 96, txt: '欧美'},
					{area: 8, txt: '日本'},
					{area: 16, txt: '韩国'},
					{area: 0, txt: '其他'},
				]
			})

			const typeObj = reactive({ //歌手类型
				type: -1,
				area: -1
			})

			function onAreaChange(item, flag) { //地区类型切换
				if(!flag) {
					typeObj.area = item.area;
				}else {
					typeObj.type = item.type;
				}
				num = 0;
				let top = document.getElementsByClassName('list-wrap')[0].scrollTop;
				if(top == 0) {
					document.getElementsByClassName('list-wrap')[0].scrollTop = 1;
				}
				singerList.value = [];
			}

			async function onLoad() {
				let res = await getSingerList(typeObj.type, typeObj.area, 20, singerList.value.length);
				singerList.value = singerList.value.concat(res);
				loadObj.loading = false;
				nextTick(() => {
					let singerHeads = document.getElementsByClassName('singer-head');
					singerHeads = Array.from(singerHeads).slice(num*20, num*20 + 20);
					singerHeads.forEach(item => {
						lazyLoadImg(item, {
							root: document.getElementsByClassName('list-wrap')[0],
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

			let router = useRouter();
			function to(item) {
				router.push({name: 'SingerDetails', query: {id: item.id}})
			}

			return {
				singerList,
				...toRefs(loadObj),
				onLoad,
				...toRefs(typeList),
				...toRefs(typeObj),
				onAreaChange,
				to,
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
		object-fit: cover;
	}
	.singer-type{
		background: #fff;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		padding: 10px;
		font-size: 14px;
		box-shadow: 0px 3px 25px rgba(0,0,0,.06);
	}
	.type-area{
		color: #333;
		font-size: 12px;
		text-decoration: underline;
		margin-right: 0px;
		width: 62px;
		display: inline-block;
		line-height: 2;
		&.on{
			color: #C20C0C;
		}
	}
	.list-wrap{
		position: absolute;
		top: 68px;
		width: 100%;
		bottom: 0px;
		padding-bottom: 50px;
		overflow: auto;
		left: 0;
	}
</style>