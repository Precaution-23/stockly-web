<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const snackbar = useSnackbarStore()

const ITEM_FIELDS = 'id name description department_id is_approved createdAt department { id name } creator { id first_name last_name }'

const ITEMS_QUERY = gql`
  query items($payload: ItemsQueryInput) {
    items(payload: $payload) { ${ITEM_FIELDS} }
  }
`
const CREATE_ITEM = gql`
  mutation createItem($payload: CreateItemInput!) {
    createItem(payload: $payload) { ${ITEM_FIELDS} }
  }
`
const APPROVE_ITEM = gql`
  mutation approveItem($id: ID!) { approveItem(id: $id) { ${ITEM_FIELDS} } }
`
const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!) { deleteItem(id: $id) }
`

const itemSearch = ref('')
const itemStatusFilter = ref<'all' | 'pending'>('all')
const { result: itemsResult, loading: itemsLoading, refetch: refetchItems } = useQuery(
  ITEMS_QUERY,
  () => ({ payload: { q: itemSearch.value || undefined, approved: itemStatusFilter.value === 'pending' ? false : undefined } }),
  { debounce: 300 },
)
const items = computed(() => itemsResult.value?.items ?? [])

const itemDialog = ref(false)
const itemDeleteDialog = ref(false)
const itemForm = ref<{ id?: string; name: string; description: string; department_id: string | null }>({ name: '', description: '', department_id: null })
const itemToDelete = ref<string | null>(null)

const { mutate: createItem, loading: savingItem } = useMutation(CREATE_ITEM)
const { mutate: deleteItem, loading: deletingItem } = useMutation(DELETE_ITEM)
const { mutate: approveItem } = useMutation(APPROVE_ITEM)
const approvingItemId = ref<string | null>(null)

async function doApproveItem(id: string) {
  approvingItemId.value = id
  try {
    await approveItem({ id })
    snackbar.show('Item approved', 'success')
    refetchItems()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    approvingItemId.value = null
  }
}

function openItemDialog(item?: any) {
  itemForm.value = item
    ? { id: item.id, name: item.name, description: item.description ?? '', department_id: item.department_id ?? null }
    : { name: '', description: '', department_id: null }
  itemDialog.value = true
}

async function saveItem() {
  try {
    await createItem({ payload: itemForm.value })
    snackbar.show(itemForm.value.id ? 'Item updated' : 'Item created', 'success')
    itemDialog.value = false
    refetchItems()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteItem(id: string) {
  itemToDelete.value = id
  itemDeleteDialog.value = true
}

async function doDeleteItem() {
  try {
    await deleteItem({ id: itemToDelete.value })
    snackbar.show('Item deleted', 'success')
    refetchItems()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    itemDeleteDialog.value = false
  }
}

// Department choices for the item dialog (unfiltered, independent of the Departments tab search)
const DEPARTMENT_OPTIONS_QUERY = gql`query departments { departments { id name } }`
const { result: departmentOptionsResult } = useQuery(DEPARTMENT_OPTIONS_QUERY)
const departmentOptions = computed(() =>
  (departmentOptionsResult.value?.departments ?? []).map((d: any) => ({ title: d.name, value: d.id }))
)

const itemHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Department', key: 'department', sortable: false },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'is_approved' },
  { title: 'Created By', key: 'creator', sortable: false },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<template>
    <VCard>
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Items</span>
        <div class="d-flex ga-4 align-center">
          <VBtnToggle v-model="itemStatusFilter" mandatory density="compact" variant="outlined" color="primary" divided>
            <VBtn value="all" size="small">All</VBtn>
            <VBtn value="pending" size="small">Pending</VBtn>
          </VBtnToggle>
          <VTextField
            v-model="itemSearch"
            placeholder="Search items..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 220px"
          />
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openItemDialog()">Add Item</VBtn>
        </div>
      </VCardTitle>
      <VDivider />
      <VDataTable
        :headers="itemHeaders"
        :items="items"
        :loading="itemsLoading"
      >
        <template #item.department="{ item }">
          <span class="text-medium-emphasis">{{ (item as any).department?.name || '—' }}</span>
        </template>
        <template #item.description="{ item }">
          <span class="text-medium-emphasis">{{ item.description || '—' }}</span>
        </template>
        <template #item.is_approved="{ item }">
          <VChip :color="(item as any).is_approved ? 'success' : 'warning'" size="small" variant="tonal">
            {{ (item as any).is_approved ? 'Approved' : 'Pending' }}
          </VChip>
        </template>
        <template #item.creator="{ item }">
          <span class="text-medium-emphasis">
            {{ (item as any).creator ? `${(item as any).creator.first_name} ${(item as any).creator.last_name}` : '—' }}
          </span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—' }}
        </template>
        <template #item.actions="{ item }">
          <VBtn
            v-if="!(item as any).is_approved"
            icon
            variant="text"
            size="small"
            color="success"
            title="Approve"
            :loading="approvingItemId === item.id"
            @click="doApproveItem(item.id)"
          >
            <VIcon size="18">mdi-check-circle-outline</VIcon>
          </VBtn>
          <VBtn icon variant="text" size="small" @click="openItemDialog(item)">
            <VIcon size="18">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon variant="text" size="small" color="error" @click="confirmDeleteItem(item.id)">
            <VIcon size="18">mdi-delete-outline</VIcon>
          </VBtn>
        </template>
      </VDataTable>
    </VCard>

    <AppDialog
      v-model="itemDialog"
      :title="itemForm.id ? 'Edit Item' : 'Add Item'"
      :loading="savingItem"
      @confirm="saveItem"
    >
      <VTextField v-model="itemForm.name" label="Name" class="mb-4" />
      <VSelect
        v-model="itemForm.department_id"
        :items="departmentOptions"
        label="Department (optional)"
        clearable
        class="mb-4"
      />
      <VTextarea v-model="itemForm.description" label="Description" rows="3" />
    </AppDialog>

    <ConfirmDialog
      v-model="itemDeleteDialog"
      title="Delete Item"
      question="Are you sure you want to delete this item?"
      confirm-text="Delete"
      :loading="deletingItem"
      @confirm="doDeleteItem"
    />
</template>
