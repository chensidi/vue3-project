import { Toast } from 'vant';

export const numFormat = (num, basicNum = 10000) => {
    return (num/basicNum).toFixed(1) + '万'
}

export const artistsFormat = (artists) => {
    let str = [];
    artists.map(obj=>{
        str.push(obj.name);
    })
    return str.join('/');
}

export const lockScroll = (e) => {
    e.stopPropagation();
    e.preventDefault();
}

export const loading = (msg='加载中...', duration=0) => {
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