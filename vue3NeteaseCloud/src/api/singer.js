import { httpGet } from './http';

export const getSingerList = async (type=-1, area=-1, initial, limit=10) => { //歌手榜
    let res = await httpGet(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.artists;
    }else{
        return Promise.reject(res.status);
    }
}