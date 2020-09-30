<template>
    <form action="/">
        <van-search 
            v-model="searchValue" 
            placeholder="请输入搜索关键词" 
            @search="onSearch"
            @clear="onClear"
            @input="onInput"
            @focus="onFocus"
        />
    </form>
</template>

<script>
    import { Search } from 'vant';
    import { ref, watch } from 'vue';
    export default {
        name: 'SearchBar',
        props: {
            searchVal: String
        },
        components: {
            'van-search': Search
        },
        setup(props, { emit }) {
            const searchValue = ref('');
            const oldSearchValue = ref('');
            let timer = null;

            function onSearch(val) { //搜索
                // console.log(val);
                emit('toSearch', val);
            }

            function onClear() { //取消
                console.log('cancel')
                emit('clear');
            }

            watch(props, (now) => {
                searchValue.value = now.searchVal;
            })

            function onInput(val) { //输入框变化
                // console.log(searchValue.value)
                clearTimeout(timer);
                timer = setTimeout(() => { //防抖
                    if(oldSearchValue.value === searchValue.value) return;
                    emit('inputChanges', searchValue.value);
                    oldSearchValue.value = searchValue.value;
                }, 200)
            }

            function onFocus() {
                // console.log(searchValue.value);
                if(searchValue.value.trim() != '') {
                    emit('focused');
                }
            }

            return {
                searchValue,
                onSearch,
                onClear,
                onInput,
                onFocus,
            }
        }
    }
</script>