<template>
    <div class="mv-tt">
        <h4>{{ info.main }}</h4>
        <span v-if="info.other" @click.stop="handler">{{ info.other }}</span>
    </div>
</template>

<script>
import { reactive } from 'vue'
export default {
    name: 'MVTitle',
    props: {
        info: {
            type: Object,
            default: function() {
                return {
                    main: '',
                    other: ''
                }
            },
            required: true
        },
        func: Function
    },
    setup(props) {
        
        const info = reactive(props.info)

        function handler() {
            props.func(info);
        }

        return {
            info,
            handler
        }
    }
}
</script>

<style lang="scss">
    .mv-tt{
        width: 100%;
        margin: 10px 0;
        h4{
            font-size: 14px;
            font-weight: normal;
            float: left;
            color: #000;
        }
        span{
            float: right;
            color: #333;
            border-radius: 10px;
            font-size: 12px;
            border: 1px solid #888;
            padding: 0 10px;
            line-height: 1.5;
        }
        &::after{
            clear: both;
            display: block;
            content: "";
        }
    }
</style>