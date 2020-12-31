import { httpGet } from './http';

export const getRecommend = async (num=6) => { //获取推荐歌单
    let res = await httpGet(`/personalized?limit=${num}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){ 
        return res.data.result;
    }else{
        return Promise.reject(res.status);
    }
}

export const getTopPlay= async (num=6) => { //获取精选歌单
    let res = await httpGet(`/top/playlist?limit=${num}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.playlists;
    }else{
        return Promise.reject(res.status);
    }
}

export const getNewMv = async (num=14) => { //获取最新MV
    let res = await httpGet(`/mv/first?limit=${num}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.data;
    }else{
        return Promise.reject(res.status);
    }
}

export const login = async (phone=13404031653, password='woshichensidi666') => { //登录
    let res = await httpGet(`/login/cellphone?phone=${phone}&password=${password}`);
}