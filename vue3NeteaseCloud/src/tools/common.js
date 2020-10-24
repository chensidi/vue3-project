import { Toast } from 'vant';

export const numFormat = (num, basicNum = 10000) => {
    return (num / basicNum).toFixed(1) + '万'
}

export const artistsFormat = (artists) => {
    let str = [];
    artists.map(obj => {
        str.push(obj.name);
    })
    return str.join('/');
}

export const lockScroll = (e) => {
    e.stopPropagation();
    e.preventDefault();
}

export const loading = (msg = '加载中...', duration = 0) => {
    Toast.loading({
        message: msg,
        duration: duration,
        forbidClick: true,
        loadingType: 'spinner'
    })
}

export const loaded = () => {
    Toast.clear();
}

export const albumAndSinger = (al, ar) => { // 张学友 / 汤宝如 - 相思风雨中
    let arArr = [];
    ar.map((obj) => {
        arArr.push(obj.name);
    })
    return arArr.join(' / ') + ' - ' + al.name;
}

export const lazyLoadImg = (target, options) => { //图片懒加载
    let io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let src = entry.target.getAttribute('data-src');
                if (src) {
                    entry.target.setAttribute('src', src);
                    entry.target.removeAttribute('data-src');
                    observer.disconnect();
                }
            }
        })
    }, options)
    io.observe(target);
}

import { getSongUrl } from '@/api/search.js';

export async function toPlay(item, store, getAudioHistory) { //点击播放
    loading('歌曲下载中...');
    let res = await getSongUrl(item.id); //下载歌曲
    store.dispatch('setAudioInfo', { //更新store
        url: res.url,
        singer: item.ar[0].name,
        song: item.name,
        poster: item.al.picUrl,
        id: item.id
    }).then(() => {
        setTimeout(() => { loaded() }, 500)
    })

    if(getAudioHistory != null) {
        let tempHistory;
        if (getAudioHistory.value.length === undefined) { //没有记录
            tempHistory = [];
        } else {
            tempHistory = getAudioHistory.value;
        }
        let key = false;
        for (let i = 0; i < tempHistory.length; i++) {
            if (tempHistory[i].id == item.id) { //之前就存在过
                key = true;
                break;
            }
        }
        if (!key) {
            tempHistory.unshift({
                url: res.url,
                singer: item.ar[0].name,
                song: item.name,
                poster: item.al.picUrl,
                id: item.id
            })
            store.dispatch('setAudioHistory', tempHistory); //更新播放记录
        }
    }
}

export const timeFormat = (time) => {
    time = new Date(time);
    return time.getFullYear() + '-' + 
    (time.getMonth() + 1).toString().padStart(2, 0) + '-' +
    (time.getDate()).toString().padStart(2, 0)
}