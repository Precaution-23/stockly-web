import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    ...setupLayouts(routes)
  ]
})

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('stockly_token')
  const isLoggedIn = !!token

  if (to.meta?.redirectIfLoggedIn && isLoggedIn) {
    return next('/dashboard')
  }

  if (!to.meta?.public && !isLoggedIn) {
    return next('/login')
  }

  next()
})

export default router
