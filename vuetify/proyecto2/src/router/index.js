// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Intro',
    component: () => import('@/views/Cover.vue'),
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
    path: '/join',
    name: 'Join',
    component: () => import('@/views/JoinView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
