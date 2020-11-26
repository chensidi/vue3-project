import { httpGet } from './http';

export const playListRequest = {
    async getTags() { //获取标签
        let res = await httpGet(`/playlist/highquality/tags`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200 && res.data.code === 200) {
            return Promise.resolve(res.data.tags);
        }else {
            return Promise.reject(res.data);
        } 
    },
    async getListByTag(tag, limit = 20, before = '') { //根据标签获取歌单列表
        let res = await httpGet(`/top/playlist/highquality?tag=${tag}&limit=${limit}&before=${before}`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200 && res.data.code === 200) {
            return Promise.resolve(res.data);
        }else {
            return Promise.reject(res.data);
        }
    },
    async getCatlist() { //所有精选标签列表
        let res = await httpGet(`/playlist/catlist`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200 && res.data.code === 200) {
            return Promise.resolve(res.data);
        }else {
            return Promise.reject(res.data);
        } 
    },
    async getQualityListByCat(cat = '', limit = 20, offset = 0) { //通过分类获取歌单
        let res = await httpGet(`/top/playlist?limit=${limit}&offset=${offset}&cat=${cat}`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200 && res.data.code === 200) {
            return Promise.resolve(res.data.playlists);
        }else {
            return Promise.reject(res.data);
        } 
    }
}