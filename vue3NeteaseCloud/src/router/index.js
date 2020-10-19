import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Jacky Music'
        }
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
        }
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
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
