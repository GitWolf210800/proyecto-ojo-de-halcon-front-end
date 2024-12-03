import Home from '@/views/Home.vue'
import MainMapClima from '@/views/MainMapClima.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   /* {     // Aun no esta listo para habilitar
      path: '/login',
      name: 'login',
      component: () => import('@/views/')
    }*/
    ,
    {
      path: '/',
      name: 'home',
      component: Home
    }
    ,
    {
      path: '/clima',
      name: 'clima',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/MainMapClima.vue')
      /*component: MainMapClima*/
    }
    ,
    {
      path: '/carrier',
      name: 'carrier',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/MainMapSalaCarrier.vue')
      /*component: MainMapClima*/
    }
  ]
})

export default router
