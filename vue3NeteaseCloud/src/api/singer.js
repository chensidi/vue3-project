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
        return res.data.artist;
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