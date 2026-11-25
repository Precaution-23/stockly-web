<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const snackbar = useSnackbarStore()

const DEPARTMENTS_QUERY = gql`
  query departments($payload: DepartmentsQueryInput) {
    departments(payload: $payload) { id name description tag inventory_prefix createdAt }
  }
`
const CREATE_DEPARTMENT = gql`
  mutation createDepartment($payload: CreateDepartmentInput!) {
    createDepartment(payload: $payload) { id name description tag inventory_prefix createdAt }
  }
`
const DELETE_DEPARTMENT = gql`
  mutation deleteDepartment($id: ID!) { deleteDepartment(id: $id) }
`

const departmentSearch = ref('')
const { result: departmentsResult, loading: departmentsLoading, refetch: refetchDepartments } = useQuery(DEPARTMENTS_QUERY, () => ({ payload: { q: departmentSearch.value || undefined } }), { debounce: 300 })
const departments = computed(() => departmentsResult.value?.departments ?? [])

const departmentDialog = ref(false)
const departmentDeleteDialog = ref(false)
const departmentForm = ref<{ id?: string; name: string; description: string; tag: string; inventory_prefix: string }>({ name: '', description: '', tag: '', inventory_prefix: '' })
const departmentToDelete = ref<string | null>(null)

const { mutate: createDepartment, loading: savingDepartment } = useMutation(CREATE_DEPARTMENT)
const { mutate: deleteDepartment, loading: deletingDepartment } = useMutation(DELETE_DEPARTMENT)

function openDepartmentDialog(dept?: any) {
  departmentForm.value = dept
    ? { id: dept.id, name: dept.name, description: dept.description ?? '', tag: dept.tag ?? '', inventory_prefix: dept.inventory_prefix ?? '' }
    : { name: '', description: '', tag: '', inventory_prefix: '' }
  departmentDialog.value = true
}

const prefixRule = (v: string) => /^[A-Z]{2,6}$/.test((v ?? '').trim()) || '2–6 letters (A–Z)'

async function saveDepartment() {
  if (prefixRule(departmentForm.value.inventory_prefix) !== true) {
    snackbar.show('Inventory prefix must be 2–6 letters (A–Z)', 'error')
    return
  }
  try {
    await createDepartment({ payload: { ...departmentForm.value, inventory_prefix: departmentForm.value.inventory_prefix.trim() } })
    snackbar.show(departmentForm.value.id ? 'Department updated' : 'Department created', 'success')
    departmentDialog.value = false
    refetchDepartments()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteDepartment(id: string) {
  departmentToDelete.value = id
  departmentDeleteDialog.value = true
}

async function doDeleteDepartment() {
  try {
    await deleteDepartment({ id: departmentToDelete.value })
    snackbar.show('Department deleted', 'success')
    refetchDepartments()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    departmentDeleteDialog.value = false
  }
}

const departmentHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Inventory Prefix', key: 'inventory_prefix' },
  { title: 'Tag', key: 'tag', sortable: false },
  { title: 'Description', key: 'description' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<template>
    <VCard>
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Departments</span>
        <div class="d-flex ga-4 align-center">
          <VTextField
            v-model="departmentSearch"
            placeholder="Search departments..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 220px"
          />
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openDepartmentDialog()">Add Department</VBtn>
        </div>
      </VCardTitle>
      <VDivider />
      <VDataTable
        :headers="departmentHeaders"
        :items="departments"
        :loading="departmentsLoading"
      >
        <template #item.inventory_prefix="{ item }">
          <VChip size="small" color="primary" variant="tonal" class="font-weight-bold" style="font-family: monospace">
            {{ (item as any).inventory_prefix }}
          </VChip>
        </template>
        <template #item.tag="{ item }">
          <VChip v-if="(item as any).tag" size="x-small" variant="tonal">{{ (item as any).tag }}</VChip>
          <span v-else class="text-medium-emphasis">—</span>
        </template>
        <template #item.description="{ item }">
          <span class="text-medium-emphasis">{{ item.description || '—' }}</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—' }}
        </template>
        <template #item.actions="{ item }">
          <VBtn icon variant="text" size="small" @click="openDepartmentDialog(item)">
            <VIcon size="18">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon variant="text" size="small" color="error" @click="confirmDeleteDepartment((item as any).id)">
            <VIcon size="18">mdi-delete-outline</VIcon>
          </VBtn>
        </template>
      </VDataTable>
    </VCard>

    <AppDialog
      v-model="departmentDialog"
      :title="departmentForm.id ? 'Edit Department' : 'Add Department'"
      :loading="savingDepartment"
      @confirm="saveDepartment"
    >
      <VTextField v-model="departmentForm.name" label="Name" class="mb-4" />
      <VTextField
        :model-value="departmentForm.inventory_prefix"
        label="Inventory Prefix *"
        placeholder="e.g. MED"
        maxlength="6"
        class="mb-4"
        :rules="[prefixRule]"
        :hint="`Used for inventory numbers, e.g. ${departmentForm.inventory_prefix || 'MED'}-0001. Changing it only affects future items.`"
        persistent-hint
        @update:model-value="(v: string) => (departmentForm.inventory_prefix = (v ?? '').toUpperCase().replace(/[^A-Z]/g, ''))"
      />
      <VTextField v-model="departmentForm.tag" label="Tag (optional)" class="mb-4" />
      <VTextarea v-model="departmentForm.description" label="Description" rows="3" />
    </AppDialog>

    <ConfirmDialog
      v-model="departmentDeleteDialog"
      title="Delete Department"
      question="Are you sure you want to delete this department?"
      confirm-text="Delete"
      :loading="deletingDepartment"
      @confirm="doDeleteDepartment"
    />
</template>
