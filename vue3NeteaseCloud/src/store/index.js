import Vuex from 'vuex'
import sessionStore from "@/tools/sessionStore.js";

export default Vuex.createStore({
    state: {
        number: 0,
        audioInfo: {
        },
        audioHistory: [] //播放历史记录
    },
    mutations: {
        setNumber(state, payload) {
            state.number = payload;
        },
        setAudioInfo(state, audioInfo) { //设置音频对象
            state.audioInfo = audioInfo;
            sessionStore.set('audioInfo', audioInfo);
        },
        setAudioHistory(state, history) { //设置播放历史
            state.audioHistory = history;
            sessionStore.set('audioHistory', history);
        }
    },
    actions: {
        setNumber({commit}, payload) {
            commit('setNumber', payload);
        },
        setAudioInfo({commit}, audioInfo) {
            commit('setAudioInfo', audioInfo);
        },
        setAudioHistory({commit}, history) {
            commit('setAudioHistory', history);
        }
    },
    getters: {
        getNumber(state) {
            return state.number
        },
        getAudioInfo(state) {
            return state.audioInfo.song ? state.audioInfo : sessionStore.get('audioInfo');
        },
        getAudioHistory(state) {
            return state.audioHistory.length ? state.audioHistory : sessionStore.get('audioHistory');
        }
    },
    modules: {
    }
});
