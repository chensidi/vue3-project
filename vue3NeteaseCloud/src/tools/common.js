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


export function playAll(his, targetGroup, store) { //播放全部
    /**
     * 第一步，把全部专辑里的歌曲list取出来，去重后加入历史记录
     * 第二步，将专辑第一首切换为当前播放，并更新store
     * 第三部，重新计算激活下标值
     */
    // console.log(albumObj.songs);
    // console.log(getAudioHistory);
    console.log(store)
    let historyArr = his.value || [], //历史数组
        songList = targetGroup, //专辑数组
        needAddArr = []; //需要往历史数组里添加的数组
    songList.map(item => {
        for(let i = 0; i < historyArr.length; i ++) {
            if(historyArr[i].id == item.id) { //有存在
                historyArr.splice(i, 1);
                i --;
                break;
            }
        }
        needAddArr.push({
            url: '',
            singer: item.ar[0].name,
            song: item.name,
            poster: item.al.picUrl,
            id: item.id
        });
    })

    let firstItem = songList[0];
    historyArr.unshift(...needAddArr);
    store.dispatch('setAudioHistory', historyArr)
    .then(() => {
        toPlay(firstItem, store);
    })
}

export const timeFormat = (time) => {
    time = new Date(time);
    return time.getFullYear() + '-' + 
    (time.getMonth() + 1).toString().padStart(2, 0) + '-' +
    (time.getDate()).toString().padStart(2, 0)
}

export function timeStampFormat(timeStamp) { //320ms ==> 05:20
    let min = parseInt(timeStamp / 60),
        sec = timeStamp % 60;
    
    min = min.toString().padStart(2, '0');
    sec = sec.toString().padStart(2, '0');

    return min + ':' + sec;
}