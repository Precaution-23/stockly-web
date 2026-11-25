<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { API_BASE } from '@/apollo-config/apiBase'
import RefreshButton from '@/components/RefreshButton.vue'

const INVENTORY_QUERY = gql`
  query inventory {
    inventory {
      id inventory_number item_name quantity unit_price total_price purchased_at createdAt invoice
      item { id name }
      vendor { id name }
      location { id name }
      approver { id first_name last_name }
      creator { id first_name last_name }
    }
  }
`

const { result, loading } = useQuery(INVENTORY_QUERY)
const inventory = computed(() => result.value?.inventory ?? [])

const search = ref('')
const filtered = computed(() => {
  if (!search.value) return inventory.value
  return inventory.value.filter((i: any) =>
    i.item_name.toLowerCase().includes(search.value.toLowerCase()) ||
    (i.inventory_number ?? '').toLowerCase().includes(search.value.toLowerCase())
  )
})

const headers = [
  { title: 'Inventory No.', key: 'inventory_number' },
  { title: 'Item', key: 'item_name' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Unit Price (GHS)', key: 'unit_price' },
  { title: 'Total (GHS)', key: 'total_price' },
  { title: 'Vendor', key: 'vendor', sortable: false },
  { title: 'Location', key: 'location', sortable: false },
  { title: 'Requested By', key: 'creator', sortable: false },
  { title: 'Approved By', key: 'approver', sortable: false },
  { title: 'Purchased At', key: 'purchased_at' },
  { title: 'Invoice', key: 'invoice', sortable: false }
]
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">Inventory</h2>
      <RefreshButton />
    </div>

    <VCard>
      <VCardText class="d-flex justify-end pb-2">
        <VTextField
          v-model="search"
          placeholder="Search item or inventory no..."
          prepend-inner-icon="mdi-magnify"
          style="max-width: 280px"
          hide-details
        />
      </VCardText>
      <VDivider />
      <VDataTable
        :headers="headers"
        :items="filtered"
        :loading="loading"
        class="text-no-wrap"
      >
        <template #item.unit_price="{ item }">
          {{ Number(item.unit_price).toFixed(2) }}
        </template>
        <template #item.total_price="{ item }">
          {{ Number(item.total_price).toFixed(2) }}
        </template>
        <template #item.vendor="{ item }">{{ item.vendor?.name ?? '—' }}</template>
        <template #item.location="{ item }">{{ item.location?.name ?? '—' }}</template>
        <template #item.creator="{ item }">
          {{ (item as any).creator ? `${(item as any).creator.first_name} ${(item as any).creator.last_name}` : '—' }}
        </template>
        <template #item.approver="{ item }">
          {{ (item as any).approver ? `${(item as any).approver.first_name} ${(item as any).approver.last_name}` : '—' }}
        </template>
        <template #item.purchased_at="{ item }">
          {{ item.purchased_at ? new Date(item.purchased_at).toLocaleDateString() : '—' }}
        </template>
        <template #item.inventory_number="{ item }">
          <span class="font-weight-bold" style="font-family: monospace">{{ (item as any).inventory_number }}</span>
        </template>
        <template #item.invoice="{ item }">
          <VBtn
            v-if="(item as any).invoice"
            icon
            variant="text"
            size="small"
            color="primary"
            title="View invoice"
            :href="`${API_BASE}/${(item as any).invoice}`"
            target="_blank"
          >
            <VIcon size="18">mdi-receipt-text-outline</VIcon>
          </VBtn>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>
