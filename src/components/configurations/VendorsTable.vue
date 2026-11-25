<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const snackbar = useSnackbarStore()

const VENDORS_QUERY = gql`
  query vendors($payload: VendorsQueryInput) {
    vendors(payload: $payload) { id name description createdAt }
  }
`
const CREATE_VENDOR = gql`
  mutation createVendor($payload: CreateVendorInput!) {
    createVendor(payload: $payload) { id name description createdAt }
  }
`
const DELETE_VENDOR = gql`
  mutation deleteVendor($id: ID!) { deleteVendor(id: $id) }
`

const vendorSearch = ref('')
const { result: vendorsResult, loading: vendorsLoading, refetch: refetchVendors } = useQuery(VENDORS_QUERY, () => ({ payload: { q: vendorSearch.value || undefined } }), { debounce: 300 })
const vendors = computed(() => vendorsResult.value?.vendors ?? [])

const vendorDialog = ref(false)
const vendorDeleteDialog = ref(false)
const vendorForm = ref<{ id?: string; name: string; description: string }>({ name: '', description: '' })
const vendorToDelete = ref<string | null>(null)

const { mutate: createVendor, loading: savingVendor } = useMutation(CREATE_VENDOR)
const { mutate: deleteVendor, loading: deletingVendor } = useMutation(DELETE_VENDOR)

function openVendorDialog(vendor?: any) {
  vendorForm.value = vendor ? { id: vendor.id, name: vendor.name, description: vendor.description ?? '' } : { name: '', description: '' }
  vendorDialog.value = true
}

async function saveVendor() {
  try {
    await createVendor({ payload: vendorForm.value })
    snackbar.show(vendorForm.value.id ? 'Vendor updated' : 'Vendor created', 'success')
    vendorDialog.value = false
    refetchVendors()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteVendor(id: string) {
  vendorToDelete.value = id
  vendorDeleteDialog.value = true
}

async function doDeleteVendor() {
  try {
    await deleteVendor({ id: vendorToDelete.value })
    snackbar.show('Vendor deleted', 'success')
    refetchVendors()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    vendorDeleteDialog.value = false
  }
}

const vendorHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<template>
    <VCard>
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Vendors</span>
        <div class="d-flex ga-4 align-center">
          <VTextField
            v-model="vendorSearch"
            placeholder="Search vendors..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 220px"
          />
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openVendorDialog()">Add Vendor</VBtn>
        </div>
      </VCardTitle>
      <VDivider />
      <VDataTable
        :headers="vendorHeaders"
        :items="vendors"
        :loading="vendorsLoading"
      >
        <template #item.description="{ item }">
          <span class="text-medium-emphasis">{{ item.description || '—' }}</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—' }}
        </template>
        <template #item.actions="{ item }">
          <VBtn icon variant="text" size="small" @click="openVendorDialog(item)">
            <VIcon size="18">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon variant="text" size="small" color="error" @click="confirmDeleteVendor(item.id)">
            <VIcon size="18">mdi-delete-outline</VIcon>
          </VBtn>
        </template>
      </VDataTable>
    </VCard>

    <AppDialog
      v-model="vendorDialog"
      :title="vendorForm.id ? 'Edit Vendor' : 'Add Vendor'"
      :loading="savingVendor"
      @confirm="saveVendor"
    >
      <VTextField v-model="vendorForm.name" label="Name" class="mb-4" />
      <VTextarea v-model="vendorForm.description" label="Description" rows="3" />
    </AppDialog>

    <ConfirmDialog
      v-model="vendorDeleteDialog"
      title="Delete Vendor"
      question="Are you sure you want to delete this vendor?"
      confirm-text="Delete"
      :loading="deletingVendor"
      @confirm="doDeleteVendor"
    />
</template>
