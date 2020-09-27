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