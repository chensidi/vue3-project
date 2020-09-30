<template>
    <div :class="className">
        <p>this is common</p>
        <slot></slot>
        <p>componentVal: {{value}} <button @click="less">-1</button></p>
        
    </div>
</template>

<script>
import { inject } from 'vue';
export default {
    name: 'Common',
    props: {
        msg: {
            type: String
        },
        className: String,
        value: Number
    },
    setup(props, ctx) {
        // console.log(props);
        // console.log(ctx);
        const less = () => {
            let nowVal = props.value;
            nowVal -= 1;
            ctx.emit('changeLess', nowVal);
        }

        let Jacky = inject('Jacky');
        console.log(Jacky)
        return {
            less
        }
    }
}
</script>