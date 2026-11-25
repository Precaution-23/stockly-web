<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { openUpload } from '@/apollo-config/upload'
import { useSnackbarStore } from '@/store/snackbar'
import RefreshButton from '@/components/RefreshButton.vue'

// Paged on the server so the page stays fast as inventory grows
const INVENTORY_QUERY = gql`
  query inventoryPage($payload: InventoryPageInput) {
    inventoryPage(payload: $payload) {
      total
      totalValue
      rows {
        id inventory_number item_name quantity unit_price total_price purchased_at createdAt invoice
        item { id name }
        vendor { id name }
        location { id name }
        approver { id first_name last_name }
        creator { id first_name last_name }
      }
    }
  }
`

const page = ref(1)
const itemsPerPage = ref(25)
const sortBy = ref<{ key: string; order?: 'asc' | 'desc' | boolean }[]>([])
const search = ref('')
const debouncedSearch = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { debouncedSearch.value = v; page.value = 1 }, 300)
})

const variables = computed(() => ({
  payload: {
    q: debouncedSearch.value || null,
    limit: itemsPerPage.value,
    offset: (page.value - 1) * itemsPerPage.value,
    sortBy: sortBy.value[0]?.key ?? null,
    sortDesc: sortBy.value[0]?.order === 'desc',
  },
}))

const { result, loading } = useQuery(INVENTORY_QUERY, variables, { fetchPolicy: 'cache-and-network' })
const inventory = computed(() => result.value?.inventoryPage?.rows ?? [])
const total = computed(() => result.value?.inventoryPage?.total ?? 0)
const totalValue = computed(() => Number(result.value?.inventoryPage?.totalValue ?? 0))

const snackbar = useSnackbarStore()
const viewInvoice = (path: string) => openUpload(path).catch((e) => snackbar.error(e))

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
      <VCardText class="d-flex align-center justify-space-between flex-wrap ga-2 pb-2">
        <div class="text-body-2 text-medium-emphasis">
          {{ total }} record{{ total === 1 ? '' : 's' }}{{ debouncedSearch ? ' found' : '' }} ·
          GHS {{ totalValue.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}
        </div>
        <VTextField
          v-model="search"
          placeholder="Search item or inventory no..."
          prepend-inner-icon="mdi-magnify"
          style="max-width: 280px"
          hide-details
        />
      </VCardText>
      <VDivider />
      <VDataTableServer
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="inventory"
        :items-length="total"
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
            @click="viewInvoice((item as any).invoice)"
          >
            <VIcon size="18">mdi-receipt-text-outline</VIcon>
          </VBtn>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #no-data>
          <div class="pa-4 text-medium-emphasis">{{ debouncedSearch ? 'Nothing matches your search' : 'No inventory yet' }}</div>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>
