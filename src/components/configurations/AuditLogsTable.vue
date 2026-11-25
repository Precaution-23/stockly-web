<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const AUDIT_LOGS_QUERY = gql`
  query auditLogs($payload: AuditLogsQueryInput) {
    auditLogs(payload: $payload) {
      id action_type model model_id diff createdAt
      user { id first_name last_name }
    }
  }
`

const auditModelFilter = ref<string | null>(null)
const auditActionFilter = ref<string | null>(null)

const { result: auditResult, loading: auditLoading } = useQuery(
  AUDIT_LOGS_QUERY,
  () => ({
    payload: {
      model: auditModelFilter.value || undefined,
      action_type: auditActionFilter.value || undefined,
    }
  }),
  { fetchPolicy: 'network-only' }
)
const auditLogs = computed(() => auditResult.value?.auditLogs ?? [])

const auditHeaders = [
  { title: 'User', key: 'user', sortable: false },
  { title: 'Action', key: 'action_type' },
  { title: 'Model', key: 'model' },
  // { title: 'Record ID', key: 'model_id', sortable: false },
  { title: 'Time', key: 'createdAt' },
]

const auditModelOptions = [
  { title: 'All', value: null },
  { title: 'Request', value: 'Request' },
  { title: 'Inventory', value: 'Inventory' },
  { title: 'Item', value: 'Item' },
  { title: 'Location', value: 'Location' },
  { title: 'Vendor', value: 'Vendor' },
  { title: 'User', value: 'User' },
  { title: 'Role', value: 'Role' },
]
const auditActionOptions = [
  { title: 'All', value: null },
  { title: 'Create', value: 'create' },
  { title: 'Update', value: 'update' },
  { title: 'Delete', value: 'delete' },
]
</script>

<template>
    <VCard>
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between flex-wrap ga-3">
        <span>Audit Logs</span>
        <div class="d-flex ga-3 align-center flex-wrap">
          <VSelect
            v-model="auditModelFilter"
            :items="auditModelOptions"
            label="Model"
            hide-details
            clearable
            style="min-width: 160px"
          />
          <VSelect
            v-model="auditActionFilter"
            :items="auditActionOptions"
            label="Action"
            hide-details
            clearable
            style="min-width: 140px"
          />
        </div>
      </VCardTitle>
      <VDivider />
      <VDataTable
        :headers="auditHeaders"
        :items="auditLogs"
        :loading="auditLoading"
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
        <template #item.model_id="{ item }">
          <span class="text-caption text-medium-emphasis">{{ item.model_id?.slice(0, 8) }}…</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleString() : '—' }}
        </template>
      </VDataTable>
    </VCard>
</template>
