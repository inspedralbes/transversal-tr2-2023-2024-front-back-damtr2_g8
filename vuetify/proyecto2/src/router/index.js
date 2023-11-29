// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Intro',
    component: () => import('@/views/Cover.vue'),
    // component: () => import('@/layouts/default/Default.vue'),
    // children: [
    //   {
    //     path: '',
    //     name: 'Home',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    //   },
    // ],
  }, {
    path: '/inici',

    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/classes',
    name: 'Classes',
    component: () => import('@/views/ChooseClass.vue'),
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/GameView.vue'),
  },
  {
    path: '/sala',
    name: 'Sala',
    component: () => import('@/views/Sala.vue'), 
  },
  {
    path: '/WaitingRoomStudent',
    name: 'WaitingRoomStudent',
    component: () => import('@/views/SalaAlumnes.vue'),
  },
  {
    path: '/introCodi',
    name: 'introCodi',
    component: () => import('@/views/Codi.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
