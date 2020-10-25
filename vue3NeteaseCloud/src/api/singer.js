import { httpGet } from './http';

export const getSingerList = async (type=-1, area=-1, limit=20, offset) => { //歌手榜
    let res = await httpGet(`/artist/list?type=${type}&area=${area}&limit=${limit}&offset=${offset}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.artists;
    }else{
        return Promise.reject(res.status);
    }
}

export const getSingerAlbum = async (id, limit=20, offset=0) => { //歌手专辑
    let res = await httpGet(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data;
    }else{
        return Promise.reject(res.status);
    }
}


export const getSingerSong = async (id, limit=20, offset=0) => { //歌手全部歌曲
    let res = await httpGet(`/artist/songs?id=${id}&limit=${limit}&offset=${offset}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.songs;
    }else{
        return Promise.reject(res.status);
    }
}


export const getSingerMV = async (id, limit=20, offset=0) => { //歌手全部歌曲
    let res = await httpGet(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.mvs;
    }else{
        return Promise.reject(res.status);
    }
}

export const getMVUrl = async (id, r=1080) => { //mv地址
    let res = await httpGet(`/mv/url?id=${id}&r=${r}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.data.url;
    }else{
        return Promise.reject(res.status);
    }
}

export const getMVDetails = async (id) => { //mv详情
    let res = await httpGet(`/mv/detail?mvid=${id}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.data;
    }else{
        return Promise.reject(res.status);
    }
}

export const getSingerDesc = async (id) => { //歌手简介
    let res = await httpGet(`/artist/desc?id=${id}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data;
    }else{
        return Promise.reject(res.status);
    }
}