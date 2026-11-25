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

  // Final Approvers only use their approvals list and their account page
  if (isLoggedIn && !to.meta?.public) {
    let group: string | undefined
    try { group = JSON.parse(localStorage.getItem('stockly_userData') || 'null')?.group_name } catch { group = undefined }
    const allowed = to.path === '/account' || to.path.startsWith('/requests/awaiting') || to.path === '/not-authorized'
    if (group === 'approver' && !allowed) return next({ path: '/requests/awaiting', query: to.path.startsWith('/requests/') ? to.query : {} })
  }

  next()
})

export default router
