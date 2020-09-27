import axios from 'axios';
const timeout = 15000;

export const httpGet = (url) => {
    return axios({
        method: 'get',
        timeout: timeout,
        url: url
    }).then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export const httpPost = (options) => {
    return axios({
        method: 'post',
        timeout: timeout,
        url: options.url,
        data: options.data,
        headers: { 'content-type': 'application/json' }
    }).then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject(err);
    })
}