<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const emit = defineEmits<{ (e: 'manage-permissions', roleId: string): void }>()

const snackbar = useSnackbarStore()

// Same fields as the page's roles query (plus user_count) so the Apollo cache is shared
const ROLES_QUERY = gql`
  query roles {
    roles {
      id name description user_count
      permissions { id resource create read update delete }
    }
  }
`
const CREATE_ROLE = gql`
  mutation createRole($payload: CreateRoleInput!) {
    createRole(payload: $payload) {
      id name description user_count
      permissions { id resource create read update delete }
    }
  }
`
const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) { deleteRole(id: $id) }
`

const { result: rolesResult, loading: rolesLoading, refetch: refetchRoles } = useQuery(ROLES_QUERY)
const roles = computed(() => rolesResult.value?.roles ?? [])

const roleDialog = ref(false)
const roleDeleteDialog = ref(false)
const roleForm = ref<{ id?: string; name: string; description: string }>({ name: '', description: '' })
const roleToDelete = ref<string | null>(null)

const { mutate: createRole, loading: savingRole } = useMutation(CREATE_ROLE)
const { mutate: deleteRole, loading: deletingRole } = useMutation(DELETE_ROLE)

function openRoleDialog(role?: any) {
  roleForm.value = role
    ? { id: role.id, name: role.name, description: role.description ?? '' }
    : { name: '', description: '' }
  roleDialog.value = true
}

async function saveRole() {
  if (!roleForm.value.name.trim()) {
    snackbar.show('Role name is required', 'error')
    return
  }
  try {
    const isNew = !roleForm.value.id
    await createRole({ payload: { ...roleForm.value, name: roleForm.value.name.trim() } })
    snackbar.show(isNew ? 'Role created — set its permissions next' : 'Role updated', 'success')
    roleDialog.value = false
    refetchRoles()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteRole(id: string) {
  roleToDelete.value = id
  roleDeleteDialog.value = true
}

async function doDeleteRole() {
  try {
    await deleteRole({ id: roleToDelete.value })
    snackbar.show('Role deleted', 'success')
    refetchRoles()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    roleDeleteDialog.value = false
  }
}

const roleHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Users', key: 'user_count' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<template>
  <VCard>
    <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
      <span>Roles</span>
      <VBtn color="primary" prepend-icon="mdi-plus" @click="openRoleDialog()">Add Role</VBtn>
    </VCardTitle>
    <VDivider />
    <VDataTable :headers="roleHeaders" :items="roles" :loading="rolesLoading">
      <template #item.name="{ item }">
        <span class="font-weight-medium">{{ (item as any).name }}</span>
      </template>
      <template #item.description="{ item }">
        <span class="text-medium-emphasis">{{ (item as any).description || '—' }}</span>
      </template>
      <template #item.actions="{ item }">
        <VBtn icon variant="text" size="small" title="Manage permissions" @click="emit('manage-permissions', (item as any).id)">
          <VIcon size="18">mdi-shield-key-outline</VIcon>
        </VBtn>
        <VBtn icon variant="text" size="small" title="Edit" @click="openRoleDialog(item)">
          <VIcon size="18">mdi-pencil-outline</VIcon>
        </VBtn>
        <VTooltip :disabled="!(item as any).user_count" location="top">
          <template #activator="{ props: tooltipProps }">
            <span v-bind="tooltipProps">
              <VBtn
                icon
                variant="text"
                size="small"
                color="error"
                :disabled="(item as any).user_count > 0"
                @click="confirmDeleteRole((item as any).id)"
              >
                <VIcon size="18">mdi-delete-outline</VIcon>
              </VBtn>
            </span>
          </template>
          Assigned to {{ (item as any).user_count }} user(s) — reassign them before deleting
        </VTooltip>
      </template>
    </VDataTable>
  </VCard>

  <AppDialog
    v-model="roleDialog"
    :title="roleForm.id ? 'Edit Role' : 'Add Role'"
    :loading="savingRole"
    @confirm="saveRole"
  >
    <VTextField v-model="roleForm.name" label="Name *" class="mb-4" autofocus />
    <VTextarea v-model="roleForm.description" label="Description" rows="3" />
    <p v-if="!roleForm.id" class="text-caption text-medium-emphasis mt-3 mb-0">
      New roles start with no access. Use the shield icon to grant permissions after creating it.
    </p>
  </AppDialog>

  <ConfirmDialog
    v-model="roleDeleteDialog"
    title="Delete Role"
    question="Are you sure you want to delete this role and its permissions?"
    confirm-text="Delete"
    :loading="deletingRole"
    @confirm="doDeleteRole"
  />
</template>
