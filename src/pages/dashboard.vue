<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useAbility } from '@casl/vue'
import RefreshButton from '@/components/RefreshButton.vue'

const DASHBOARD_STATS = gql`
  query dashboardStats {
    dashboardStats {
      scope
      totalRequests pendingRequests forwardedRequests awaitingFinalApprovalRequests approvedRequests
      rejectedRequests purchasedRequests totalInventoryItems totalInventoryValue
      recentActivity {
        id action_type model model_id record_name createdAt
        user { id first_name last_name }
      }
      recentRequests { id item_name quantity total_price status createdAt }
    }
  }
`

const { result, loading } = useQuery(DASHBOARD_STATS)
const stats = computed(() => result.value?.dashboardStats)

// Admin/Operation/Finance see church-wide figures; everyone else sees their own requests
const isPersonal = computed(() => stats.value?.scope === 'mine')
// The API sends these only to roles allowed to see them (null otherwise)
const { can } = useAbility()
const canSeeActivity = computed(() => can('read', 'AuditLogs'))
const hasInventory = computed(() => stats.value?.totalInventoryItems != null)

const statCards = computed(() => {
  const s = stats.value
  const cards = [
    { label: isPersonal.value ? 'My Requests' : 'Total Requests', value: s?.totalRequests ?? 0, icon: 'mdi-file-document-outline', color: 'primary' },
    { label: 'Pending', value: s?.pendingRequests ?? 0, icon: 'mdi-clock-outline', color: 'warning' },
    { label: 'Forwarded', value: s?.forwardedRequests ?? 0, icon: 'mdi-arrow-right-circle-outline', color: 'info' },
    { label: 'Awaiting Final Approval', value: s?.awaitingFinalApprovalRequests ?? 0, icon: 'mdi-account-clock-outline', color: 'deep-purple' },
    { label: 'Approved', value: s?.approvedRequests ?? 0, icon: 'mdi-check-circle-outline', color: 'success' },
    { label: 'Rejected', value: s?.rejectedRequests ?? 0, icon: 'mdi-close-circle-outline', color: 'error' },
    { label: 'Purchased', value: s?.purchasedRequests ?? 0, icon: 'mdi-shopping-outline', color: 'secondary' },
  ]
  if (hasInventory.value) {
    cards.push(
      { label: 'Inventory Items', value: s?.totalInventoryItems ?? 0, icon: 'mdi-warehouse', color: 'primary' },
      { label: 'Inventory Value (GHS)', value: Number(s?.totalInventoryValue ?? 0).toLocaleString('en-GH', { minimumFractionDigits: 2 }), icon: 'mdi-cash-multiple', color: 'success' },
    )
  }
  return cards
})

const statusColor = (status: string) => ({
  pending: 'warning', forwarded: 'info', awaiting_final_approval: 'deep-purple', approved: 'success',
  rejected: 'error', purchased: 'primary',
}[status] || 'default')
const statusLabel = (status: string) => (status === 'awaiting_final_approval' ? 'Awaiting final approval' : status)

const requestHeaders = [
  { title: 'Item', key: 'item_name', sortable: false },
  { title: 'Qty', key: 'quantity', sortable: false },
  { title: 'Total (GHS)', key: 'total_price', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Requested', key: 'createdAt', sortable: false },
]

const auditHeaders = [
  { title: 'User', key: 'user', sortable: false },
  { title: 'Action', key: 'action_type' },
  { title: 'Model', key: 'model' },
  { title: 'Time', key: 'createdAt' }
]
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Dashboard</h2>
        <div v-if="stats" class="text-body-2 text-medium-emphasis">
          {{ isPersonal ? 'Showing your own requests' : 'Showing all church requests' }}
        </div>
      </div>
      <RefreshButton />
    </div>

    <VProgressLinear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Stat Cards -->
    <VRow class="mb-6">
      <VCol v-for="card in statCards" :key="card.label" cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-body-1">{{ card.label }}</div>
              <div class="text-h4 mt-1">{{ card.value }}</div>
            </div>
            <VAvatar :color="card.color" variant="tonal" rounded size="44">
              <VIcon :icon="card.icon" size="26" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- My Recent Requests (personal dashboard) -->
    <VCard v-if="isPersonal" class="mb-6">
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
        <span>My Recent Requests</span>
        <VBtn variant="text" size="small" append-icon="mdi-arrow-right" to="/requests/mine">View all</VBtn>
      </VCardTitle>
      <VDivider />
      <VDataTable
        :headers="requestHeaders"
        :items="stats?.recentRequests ?? []"
        :loading="loading"
        :items-per-page="-1"
        hide-default-footer
        class="text-no-wrap"
      >
        <template #item.total_price="{ item }">{{ Number(item.total_price).toFixed(2) }}</template>
        <template #item.status="{ item }">
          <VChip :color="statusColor(item.status)" size="small" variant="tonal" class="text-capitalize">{{ statusLabel(item.status) }}</VChip>
        </template>
        <template #item.createdAt="{ item }">{{ new Date(item.createdAt).toLocaleDateString() }}</template>
        <template #no-data>
          <div class="pa-4 text-medium-emphasis">You haven't made any requests yet.</div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Recent Activity -->
    <VCard v-if="canSeeActivity">
      <VCardTitle class="pa-4 pb-2">Recent Activity</VCardTitle>
      <VDivider />
      <VDataTable
        :headers="auditHeaders"
        :items="stats?.recentActivity ?? []"
        :loading="loading"
        class="text-no-wrap"
      >
        <template #item.user="{ item }">
          {{ item.user ? `${item.user.first_name} ${item.user.last_name}` : 'System' }}
        </template>
        <template #item.action_type="{ item }">
          <VChip
            size="x-small"
            :color="item.action_type === 'create' ? 'success' : item.action_type === 'delete' ? 'error' : 'info'"
            variant="tonal"
          >
            {{ item.action_type }}
          </VChip>
        </template>
        <template #item.record_name="{ item }">
          <span class="text-caption text-medium-emphasis">
            {{ item.record_name ?? (item.model_id?.slice(0, 8) + '…') }}
          </span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleString() : '—' }}
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>
