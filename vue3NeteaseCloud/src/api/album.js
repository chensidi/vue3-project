import { httpGet } from './http';

export const getAlbum = async (id) => { //专辑
    let res = await httpGet(`/album?id=${id}`).catch(err => {
        return Promise.reject(err);
    })
    if(res.status === 200){
        return res.data;
    }else{
        return Promise.reject(res.status);
    }
}