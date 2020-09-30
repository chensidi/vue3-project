module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: [
                "> 1%",
                "last 5 versions",
                "not ie <= 8",
                "ios >= 7",
                "android >= 4.0"
            ]
        },
        'postcss-pxtorem': {
            rootValue: 20,//结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
            propList: ['*']
        }
    }
}