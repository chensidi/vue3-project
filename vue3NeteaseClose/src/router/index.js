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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },

  {
    path: '/sort',
    name: 'Sort',
    component: () => import('@/views/sort.vue'),
    meta: {
      title: '排行榜'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
