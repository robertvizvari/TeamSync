import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'TeamSync - Home',
        requiresAuth: false,
      },
    },
    {
      path: '/dashboard/:urlId?',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        title: 'TeamSync - Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/Account.vue'),
      meta: {
        title: 'TeamSync - Account',
        requiresAuth: true,
      },
    },
    {
      path: '/invite/:projectId',
      name: 'invite',
      component: () => import('@/views/Invite.vue'),
      meta: {
        title: 'TeamSync - Invitation',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'TeamSync - Log in',
        requiresGuest: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        title: 'TeamSync - Register',
        requiresGuest: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/404.vue'),
      meta: {
        title: '404 - Page not found',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  document.title = to.meta?.title ?? 'TeamSync'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard/mytasks')
  } else {
    next()
  }
})

export default router
