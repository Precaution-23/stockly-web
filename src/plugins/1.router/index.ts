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

  // Final Approvers handle final approvals under Manage, so links to the awaiting tab
  // (emails, notifications) open there instead, keeping ?id= for the deep link
  if (isLoggedIn && to.path === '/requests/awaiting') {
    let group: string | undefined
    try { group = JSON.parse(localStorage.getItem('stockly_userData') || 'null')?.group_name } catch { group = undefined }
    if (group === 'approver') return next({ path: '/requests/manage', query: to.query })
  }

  next()
})

export default router
