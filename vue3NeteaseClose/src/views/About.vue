<template>
  <div class="about">
		<h1>This is an about page</h1>
		<div>
			<p>{{store.getters.getNumber}}</p>
			<p>
				<button @click="add">+1</button>
				<button @click="less">-1</button>
			</p>
		</div>
		<div class="demodiv">
			<p>123</p>
		</div>
  </div>
</template>

<script>
	

	// Vue.use(Button);
	import { useStore } from 'vuex';
	import {toRefs, ref} from 'vue';
	export default {
		name: "About",
		setup(props, ctx) {
			const store = useStore();

			function add() {
				let val = store.getters.getNumber;
				store.dispatch('setNumber', val + 1);
			}

			function less() {
				let val = store.getters.getNumber;
				store.dispatch('setNumber', val - 1);
			}

			const number = ref(store.state.number)

			return {
				add,
				less,
				store
			}
		}
	};
</script>

<style lang="scss" scoped>
	.demodiv{
		position: relative;
		width: 100px;
		height: 100px;
		background: #999;
		&::after{
			display: block;
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			background: rgba(255,255,255,.6);
		}
		&>p{
			font-size: 13px;
		}
	}
</style>
