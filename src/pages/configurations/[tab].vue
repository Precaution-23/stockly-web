<script setup lang="ts">
import ItemsTable from '@/components/configurations/ItemsTable.vue'
import DepartmentsTable from '@/components/configurations/DepartmentsTable.vue'
import LocationsTable from '@/components/configurations/LocationsTable.vue'
import VendorsTable from '@/components/configurations/VendorsTable.vue'
import ApprovalRulesTable from '@/components/configurations/ApprovalRulesTable.vue'
import AuditLogsTable from '@/components/configurations/AuditLogsTable.vue'
import RefreshButton from '@/components/RefreshButton.vue'

const route = useRoute()
const router = useRouter()

const tab = computed(() => route.params.tab as string)
// Single source for the tab bar and the table rendered for each tab
const tabs = markRaw([
  { label: 'Items', value: 'items', component: ItemsTable },
  { label: 'Departments', value: 'departments', component: DepartmentsTable },
  { label: 'Locations', value: 'locations', component: LocationsTable },
  { label: 'Vendors', value: 'vendors', component: VendorsTable },
  { label: 'Approval Rules', value: 'approval-rules', component: ApprovalRulesTable },
  { label: 'Audit Logs', value: 'audit-logs', component: AuditLogsTable },
])
const activeTab = computed(() => tabs.find(t => t.value === tab.value))

function setTab(value: string) {
  router.push({ name: 'configurations-tab', params: { tab: value } })
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">Configurations</h2>
      <RefreshButton />
    </div>

    <VTabs :model-value="tab" @update:model-value="setTab" class="mb-6">
      <VTab v-for="t in tabs" :key="t.value" :value="t.value">{{ t.label }}</VTab>
    </VTabs>

    <component :is="activeTab.component" v-if="activeTab" :key="activeTab.value" />
  </div>
</template>
