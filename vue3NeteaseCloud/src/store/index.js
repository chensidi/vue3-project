import Vuex from 'vuex'
import sessionStore from "@/tools/sessionStore.js";

export default Vuex.createStore({
    state: {
        number: 0,
        audioUrl: 'https://m10.music.126.net/20201003120503/7d9debfe4241835a5e367c183dea8c0f/yyaac/obj/wonDkMOGw6XDiTHCmMOi/3036223394/aad5/1cfb/1f8a/5bb0e1ba32b5af7f0383a7d5af4b91f7.m4a',
        audioInfo: {
        }
    },
    mutations: {
        setNumber(state, payload) {
            state.number = payload;
        },
        setAudioUrl(state, url) {
            state.audioUrl = url;
        },
        setAudioInfo(state, audioInfo) { //设置音频对象
            state.audioInfo = audioInfo;
            sessionStore.set('audioInfo', audioInfo);
        }
    },
    actions: {
        setNumber({commit}, payload) {
            commit('setNumber', payload);
        },
        setAudioUrl({commit}, url) {
            commit('setAudioUrl', url);
        },
        setAudioInfo({commit}, audioInfo) {
            commit('setAudioInfo', audioInfo);
        }
    },
    getters: {
        getNumber(state) {
            return state.number
        },
        getAudioInfo(state) {
            return state.audioInfo.song ? state.audioInfo : sessionStore.get('audioInfo');
        }
    },
    modules: {
    }
});
