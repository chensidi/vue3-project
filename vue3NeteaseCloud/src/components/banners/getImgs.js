import { httpGet } from '@/api/http.js';

const getImgs = async () => {
    let res = await httpGet('/banner').catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data.banners;
    }else{
        return Promise.reject(res.status);
    }
}

export default getImgs;