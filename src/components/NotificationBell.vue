<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'

const router = useRouter()
const snackbar = useSnackbarStore()

const NOTIFICATIONS_QUERY = gql`
  query myNotifications($limit: Int) {
    myNotifications(limit: $limit) {
      unread_count
      items { id type title message link read_at createdAt }
    }
  }
`
const MARK_READ = gql`mutation markNotificationRead($id: ID!) { markNotificationRead(id: $id) { id read_at } }`
const MARK_ALL_READ = gql`mutation markAllNotificationsRead { markAllNotificationsRead }`

// Poll every 30s, and refresh as soon as the tab regains focus
const { result, refetch } = useQuery(NOTIFICATIONS_QUERY, { limit: 20 }, { pollInterval: 30000 })
const focused = useWindowFocus()
watch(focused, (isFocused) => { if (isFocused) refetch() })

const feed = computed(() => result.value?.myNotifications)
const unread = computed(() => feed.value?.unread_count ?? 0)
const items = computed(() => feed.value?.items ?? [])

const { mutate: markRead } = useMutation(MARK_READ)
const { mutate: markAllRead, loading: markingAll } = useMutation(MARK_ALL_READ)

const menu = ref(false)

const TYPE_STYLES: Record<string, { icon: string; color: string }> = {
  request_created: { icon: 'mdi-file-document-plus-outline', color: 'info' },
  request_forwarded: { icon: 'mdi-arrow-right-circle-outline', color: 'info' },
  request_final_approval: { icon: 'mdi-account-clock-outline', color: 'deep-purple' },
  request_approved: { icon: 'mdi-check-circle-outline', color: 'success' },
  request_rejected: { icon: 'mdi-close-circle-outline', color: 'error' },
  request_purchased: { icon: 'mdi-cart-check', color: 'primary' },
  item_pending_approval: { icon: 'mdi-package-variant', color: 'warning' },
  item_approved: { icon: 'mdi-package-variant-closed-check', color: 'success' },
}
const styleFor = (type: string) => TYPE_STYLES[type] ?? { icon: 'mdi-bell-outline', color: 'secondary' }

function timeAgo(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(value).toLocaleDateString()
}

async function openNotification(n: any) {
  menu.value = false
  if (!n.read_at) {
    try {
      await markRead({ id: n.id })
      refetch()
    } catch (e) {
      snackbar.error(e, "Couldn't mark the notification as read")
    }
  }
  if (n.link) router.push(n.link)
}

async function onMarkAllRead() {
  try {
    await markAllRead()
    refetch()
    snackbar.success('All notifications marked as read')
  } catch (e) {
    snackbar.error(e, "Couldn't mark notifications as read")
  }
}
</script>

<template>
  <VMenu v-model="menu" location="bottom end" offset="8" :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <VBtn v-bind="menuProps" icon variant="text" class="me-1" title="Notifications">
        <VBadge :model-value="unread > 0" :content="unread > 9 ? '9+' : unread" color="error">
          <VIcon>mdi-bell-outline</VIcon>
        </VBadge>
      </VBtn>
    </template>

    <VCard width="360">
      <VCardTitle class="d-flex align-center justify-space-between py-3 px-4">
        <span class="text-subtitle-1 font-weight-bold">Notifications</span>
        <VBtn variant="text" size="small" color="primary" :disabled="!unread" :loading="markingAll" @click="onMarkAllRead">
          Mark all read
        </VBtn>
      </VCardTitle>
      <VDivider />

      <div v-if="!items.length" class="pa-8 text-center text-medium-emphasis">
        <VIcon size="36" class="mb-2">mdi-bell-check-outline</VIcon>
        <div class="text-body-2">You're all caught up</div>
      </div>

      <VList v-else density="compact" class="py-0" style="max-height: 420px; overflow-y: auto">
        <template v-for="(n, i) in items" :key="n.id">
          <VDivider v-if="i > 0" />
          <VListItem :class="{ 'notification-unread': !n.read_at }" class="py-3" @click="openNotification(n)">
            <template #prepend>
              <VAvatar :color="styleFor(n.type).color" variant="tonal" size="36" class="me-3">
                <VIcon size="20">{{ styleFor(n.type).icon }}</VIcon>
              </VAvatar>
            </template>
            <VListItemTitle class="text-body-2" :class="{ 'font-weight-bold': !n.read_at }">{{ n.title }}</VListItemTitle>
            <div class="text-caption text-medium-emphasis notification-message">{{ n.message }}</div>
            <div class="text-caption text-disabled mt-1">{{ timeAgo(n.createdAt) }}</div>
            <template #append>
              <VIcon v-if="!n.read_at" color="primary" size="10">mdi-circle</VIcon>
            </template>
          </VListItem>
        </template>
      </VList>
    </VCard>
  </VMenu>
</template>

<style scoped>
.notification-unread {
  background: rgba(var(--v-theme-primary), 0.06);
}
.notification-message {
  white-space: normal;
  line-height: 1.35;
}
</style>
