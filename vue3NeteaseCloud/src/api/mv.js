import { httpGet } from './http';


export default {
    async getAllMv (area='全部', order='上升最快', limit=4, offset=0) { //获取全部MV
        let res = await httpGet(`/mv/all?area=${area}&order=${order}&limit=${limit}&offsset=${offset}}`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200){
            return res.data.data;
        }else{
            return Promise.reject(res.status);
        }
    },
    async getRecommendMv() { //推荐mv
        let res = await httpGet(`/personalized/mv`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200){
            return res.data.result;
        }else{
            return Promise.reject(res.status);
        }
    },
    async getNewMv(area="", limit=30) { //最新mv
        let res = await httpGet(`/mv/first?area=${area}&limit=${limit}`).catch(err => {
            return Promise.reject(err);
        })
        if(res.status === 200){
            return res.data.data;
        }else{
            return Promise.reject(res.status);
        }
    }
}