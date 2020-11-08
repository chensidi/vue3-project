import { httpGet } from './http';

export const getTopList = async () => { //排行榜
    let res = await httpGet(`/toplist/detail`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.list;
    }else{
        return Promise.reject(res.status);
    }
}

export const getTopDetails = async (id) => { //排行榜详情
    let res = await httpGet(`/playlist/detail?id=${id}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data;
    }else{
        return Promise.reject(res.status);
    }
}