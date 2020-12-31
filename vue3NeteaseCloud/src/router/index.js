import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Jacky Music'
        },
        children: [
            {
                path: 'playList/:id',
                name: 'PlayList',
                component: () => import('@/views/playList.vue'),
                meta: {
                    title: '歌单'
                }
            }
        ]
    },
    {
        path: '/singer',
        name: 'Singer',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/singer.vue'),
        meta: {
            title: '歌手列表'
        },
        children: [
            {
                path: 'singerDetails',
                name: 'SingerDetails',
                component: () => import('@/views/singerDetails.vue'),
                meta: {
                    title: '歌手详情'
                }
            }
        ]
    },

    {
        path: '/sort',
        name: 'Sort',
        component: () => import('@/views/sort.vue'),
        meta: {
            title: '排行榜'
        },
        children: [
            {
                path: 'details',
                name: 'SortDetails',
                component: () => import('@/views/sortDetails.vue'),
                meta: {
                    title: '排行榜详情'
                }
            }
        ]
    },

    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/search.vue'),
        meta: {
            title: '搜索'
        }
    },

    {
        path: '/album/:id',
        name: 'Album',
        component: () => import('@/views/album.vue'),
        meta: {
            title: '专辑'
        }
    },

    {
        path: '/playSquare',
        name: 'PlaySquare',
        component: () => import('@/views/playSquare.vue'),
        meta: {
            title: '歌单广场'
        },
        children: [
            {
                path: 'playList/:id',
                name: 'PlaySquarePlayList',
                component: () => import('@/views/playList.vue'),
                meta: {
                    title: '歌单'
                }
            }
        ]
    },

    {
        path: '/highqualitySquare',
        name: 'HighqualitySquare',
        component: () => import('@/views/highqualitySquare.vue'),
        meta: {
            title: '精选歌单广场'
        },
        children: [
            {
                path: 'playList/:id',
                name: 'HighqualitySquarePlayList',
                component: () => import('@/views/playList.vue'),
                meta: {
                    title: '歌单'
                }
            }
        ]
    },

    {
        path: '/MvIdex',
        name: 'MvIndex',
        component: () => import('@/views/MvIndex.vue'),
        meta: {
            title: 'MV广场'
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
