import { httpGet } from './http';

export const getHotSearch = async () => { //搜索热榜
    let res = await httpGet(`/search/hot/detail`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.data;
    }else{
        return Promise.reject(res.status);
    }
}

export const getSuggestSearch = async (kw) => { //建议搜索
    let res = await httpGet(`/search/suggest?keywords= ${kw}&type=mobile`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.result;
    }else{
        return Promise.reject(res.status);
    }
}

export const getSearchByKw = async (kw, limit=20, offset) => { //通过关键字搜索
    let res = await httpGet(`/cloudsearch?keywords= ${kw}&limit=${limit}&offset=${offset}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.result;
    }else{
        return Promise.reject(res.status);
    }
}