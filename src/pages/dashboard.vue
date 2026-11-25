<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import RefreshButton from '@/components/RefreshButton.vue'

const DASHBOARD_STATS = gql`
  query dashboardStats {
    dashboardStats {
      totalRequests pendingRequests forwardedRequests awaitingFinalApprovalRequests approvedRequests
      rejectedRequests purchasedRequests totalInventoryItems totalInventoryValue
      recentActivity {
        id action_type model model_id record_name createdAt
        user { id first_name last_name }
      }
    }
  }
`

const { result, loading } = useQuery(DASHBOARD_STATS)
const stats = computed(() => result.value?.dashboardStats)

const statCards = computed(() => [
  { label: 'Total Requests', value: stats.value?.totalRequests ?? 0, icon: 'mdi-file-document-outline', color: 'primary' },
  { label: 'Pending', value: stats.value?.pendingRequests ?? 0, icon: 'mdi-clock-outline', color: 'warning' },
  { label: 'Forwarded', value: stats.value?.forwardedRequests ?? 0, icon: 'mdi-arrow-right-circle-outline', color: 'info' },
  { label: 'Awaiting Final Approval', value: stats.value?.awaitingFinalApprovalRequests ?? 0, icon: 'mdi-account-clock-outline', color: 'deep-purple' },
  { label: 'Approved', value: stats.value?.approvedRequests ?? 0, icon: 'mdi-check-circle-outline', color: 'success' },
  { label: 'Rejected', value: stats.value?.rejectedRequests ?? 0, icon: 'mdi-close-circle-outline', color: 'error' },
  { label: 'Purchased', value: stats.value?.purchasedRequests ?? 0, icon: 'mdi-shopping-outline', color: 'secondary' },
  { label: 'Inventory Items', value: stats.value?.totalInventoryItems ?? 0, icon: 'mdi-warehouse', color: 'primary' },
  { label: 'Inventory Value (GHS)', value: Number(stats.value?.totalInventoryValue ?? 0).toLocaleString('en-GH', { minimumFractionDigits: 2 }), icon: 'mdi-cash-multiple', color: 'success' }
])

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
      <h2 class="text-h5 font-weight-bold">Dashboard</h2>
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

    <!-- Recent Activity -->
    <VCard>
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
