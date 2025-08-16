import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/auth.js'

const accessMode = import.meta.env.VITE_ACCESS_MODE;

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/clima',
    name: 'clima',
    component: () => import('@/views/MainMapClima.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mantenimiento',
    name: 'mantenimiento',
    component: () => import('@/views/MainMapMantenimiento.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/carrier',
    name: 'carrier',
    component: () => import('@/views/MainMapSalaCarrier.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/salaFiltro',
    name: 'salaFiltro',
    component: () => import('@/views/MainMapSalaFiltros.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/serial',
    name: 'serial',
    component: () => import('@/views/Serial.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🛡️ Guard de navegación
router.beforeEach((to, from, next) => {
  const isLoggedIn = isAuthenticated()

  if (accessMode === 'internet') {
    if (to.meta.requiresAuth && !isLoggedIn) {
      return next('/login')
    }
  }

  next()
})

export default router