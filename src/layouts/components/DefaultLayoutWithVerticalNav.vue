<script setup lang="ts">
import navItems from '@/navigation/vertical'
import { useAuthStore } from '@/store/auth'
import { useAbility } from '@casl/vue'
import NotificationBell from '@/components/NotificationBell.vue'
import { useSnackbarStore } from '@/store/snackbar'

const authStore = useAuthStore()
const { can } = useAbility()
const drawer = ref(true)
const rail = ref(false)

const userData = computed(() => {
  const stored = localStorage.getItem('stockly_userData')
  return stored ? JSON.parse(stored) : null
})

const groupLabel = computed(() => (userData.value?.group_name === 'approver' ? 'Final Approver' : userData.value?.group_name))

const filteredNavItems = computed(() => {
  const group = userData.value?.group_name
  return navItems.filter((item: any) => {
    // Items limited to certain groups; Final Approvers see nothing else
    if (item.groups) return item.groups.includes(group)
    if (group === 'approver') return false
    if (item.heading) {
      if (item.action && item.subject) return can(item.action, item.subject)
      return true
    }
    if (item.action && item.subject) return can(item.action, item.subject)
    return true
  })
})

const handleLogout = () => {
  authStore.logout()
}

// ─── Session expiry: warn 10 minutes before the login token runs out, then sign out ───
const snackbar = useSnackbarStore()
const sessionEndingSoon = ref(false)
const timers: ReturnType<typeof setTimeout>[] = []

const tokenExpiry = (): number | null => {
  try {
    const token = localStorage.getItem('stockly_token')
    const payload = token ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) : null
    return payload?.exp ? payload.exp * 1000 : null
  }
  catch {
    return null
  }
}

onMounted(() => {
  const exp = tokenExpiry()
  if (!exp) return
  const msLeft = exp - Date.now()
  const WARN_BEFORE = 10 * 60 * 1000
  // setTimeout can't wait longer than ~24.8 days (dev tokens last a year), so skip those
  if (msLeft > 2 ** 31 - 1) return
  timers.push(setTimeout(() => { sessionEndingSoon.value = true }, Math.max(msLeft - WARN_BEFORE, 0)))
  timers.push(setTimeout(() => {
    sessionEndingSoon.value = false
    snackbar.error('Your session has ended. Please log in again.')
    authStore.logout()
  }, Math.max(msLeft, 0)))
})
onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <VApp>
    <!-- Navigation Drawer -->
    <VNavigationDrawer v-model="drawer" :rail="rail" permanent>
      <!-- Logo -->
      <div class="d-flex align-center px-3 py-4">
        <VIcon color="primary" size="28">mdi-package-variant-closed</VIcon>
        <span v-if="!rail" class="text-h6 font-weight-bold ml-3 flex-grow-1">Stockly</span>
        <VSpacer v-if="!rail" />
        <VBtn
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          @click="rail = !rail"
        />
      </div>

      <VDivider />

      <VList density="compact" nav class="mt-2">
        <template v-for="item in filteredNavItems" :key="item.title || item.heading">
          <!-- Heading -->
          <VListSubheader v-if="item.heading && !rail" class="mt-3 text-uppercase text-caption">
            {{ item.heading }}
          </VListSubheader>
          <VDivider v-else-if="item.heading && rail" class="my-2" />

          <!-- Nav item -->
          <VListItem
            v-else
            :to="item.to"
            :prepend-icon="item.icon?.icon"
            :title="item.title"
            rounded="lg"
            active-color="primary"
          />
        </template>
      </VList>

      <!-- User Profile + Logout at bottom -->
      <template #append>
        <VDivider />
        <VList density="compact" nav class="py-2">
          <VListItem
            to="/account"
            prepend-icon="mdi-account-cog-outline"
            title="My Account"
            rounded="lg"
            active-color="primary"
          />
          <VListItem
            prepend-icon="mdi-logout"
            title="Logout"
            rounded="lg"
            base-color="error"
            @click="handleLogout"
          />
        </VList>
        <VDivider v-if="!rail" />
        <div v-if="!rail" class="d-flex align-center px-4 py-3 ga-3">
          <VIcon size="28">mdi-account-circle-outline</VIcon>
          <div class="overflow-hidden">
            <div class="text-body-2 font-weight-medium text-truncate">
              {{ userData ? `${userData.first_name} ${userData.last_name}` : 'User' }}
            </div>
            <div class="text-caption text-medium-emphasis">{{ groupLabel }}</div>
          </div>
        </div>
      </template>
    </VNavigationDrawer>

    <!-- App Bar -->
    <VAppBar elevation="0" border="b">
      <VAppBarTitle>
        <span class="text-body-1 font-weight-medium">
          {{ userData?.first_name ? `Welcome, ${userData.first_name}` : 'Stockly' }}
        </span>
      </VAppBarTitle>
      <template #append>
        <NotificationBell />
        <VChip
          :color="userData?.group_name === 'admin' ? 'primary' : userData?.group_name === 'finance' ? 'success' : 'info'"
          variant="tonal"
          size="small"
          class="text-capitalize"
        >
          {{ groupLabel }}
        </VChip>
        <VBtn
          variant="text"
          prepend-icon="mdi-logout"
          color="error"
          class="mx-2"
          @click="handleLogout"
        >
          Logout
        </VBtn>
      </template>
    </VAppBar>

    <!-- Session about to expire -->
    <VSnackbar v-model="sessionEndingSoon" :timeout="-1" color="warning" location="top">
      Your session ends in less than 10 minutes. Save your work, then log in again to continue.
      <template #actions>
        <VBtn variant="text" @click="handleLogout">Log in again</VBtn>
        <VBtn variant="text" @click="sessionEndingSoon = false">Dismiss</VBtn>
      </template>
    </VSnackbar>

    <!-- Main content -->
    <VMain>
      <VContainer fluid class="pa-6">
        <RouterView />
      </VContainer>
    </VMain>
  </VApp>
</template>
