import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'TeamSync - Home',
      },
    },
    {
      path: '/dashboard/:urlId?',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        title: 'TeamSync - Dashboard',
      },
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'TeamSync - Log in',
      },
    },
    {
      path: '/register',
      component: () => import('@/views/Register.vue'),
      meta: {
        title: 'TeamSync - Register',
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

router.beforeEach((to, from) => {
  document.title = to.meta?.title ?? 'TeamSync'
})

export default router
