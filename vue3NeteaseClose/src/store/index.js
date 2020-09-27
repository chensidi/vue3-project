import Vuex from 'vuex'

export default Vuex.createStore({
    state: {
        number: 0
    },
    mutations: {
        setNumber(state, payload) {
            state.number = payload;
        }
    },
    actions: {
        setNumber({commit}, payload) {
            commit('setNumber', payload);
        }
    },
    getters: {
        getNumber(state) {
            return state.number
        }
    },
    modules: {
    }
});
