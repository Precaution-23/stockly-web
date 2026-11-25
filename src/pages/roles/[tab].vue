<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import RolesTable from '@/components/roles/RolesTable.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import PasswordRequirements from '@/components/PasswordRequirements.vue'
import { strongPasswordValidator } from '@/@core/utils/passwordPolicy'

const route = useRoute()
const router = useRouter()
const snackbar = useSnackbarStore()

const tab = computed(() => route.params.tab as string)
const tabs = [
  { label: 'Users', value: 'users' },
  { label: 'Roles', value: 'roles' },
  { label: 'Permissions', value: 'permissions' },
]

function setTab(value: string) {
  router.push({ name: 'roles-tab', params: { tab: value } })
}

// ─── Shared data ─────────────────────────────────────────────────────────────

const ROLES_QUERY = gql`
  query roles {
    roles {
      id name description user_count
      permissions { id resource create read update delete }
    }
  }
`
const { result: rolesResult, loading: rolesLoading, refetch: refetchRoles } = useQuery(ROLES_QUERY)
const roles = computed(() => rolesResult.value?.roles ?? [])

// ─── Users Tab ────────────────────────────────────────────────────────────────

const USERS_QUERY = gql`
  query users {
    users {
      id first_name last_name email group_name is_active
      role { id name }
    }
  }
`
const CREATE_USER = gql`
  mutation createUser($payload: CreateUserInput!) {
    createUser(payload: $payload) {
      id first_name last_name email group_name is_active
      role { id name }
    }
  }
`
const DELETE_USER = gql`
  mutation deleteUser($id: ID!) { deleteUser(id: $id) }
`

const { result: usersResult, loading: usersLoading, refetch: refetchUsers } = useQuery(USERS_QUERY)
const users = computed(() => usersResult.value?.users ?? [])

const userDialog = ref(false)
const userDeleteDialog = ref(false)
const userToDelete = ref<string | null>(null)
const userForm = ref<{
  id?: string
  first_name: string
  last_name: string
  email: string
  password: string
  group_name: string
  role_id: string | null
  is_active: boolean
}>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  group_name: 'requester',
  role_id: null,
  is_active: true,
})

const { mutate: createUser, loading: savingUser } = useMutation(CREATE_USER)
const { mutate: deleteUser, loading: deletingUser } = useMutation(DELETE_USER)

const groupOptions = [
  { title: 'Admin', value: 'admin' },
  { title: 'Operation', value: 'operation' },
  { title: 'Finance', value: 'finance' },
  { title: 'Requester', value: 'requester' },
]
const roleOptions = computed(() => roles.value.map((r: any) => ({ title: r.name, value: r.id })))

function openUserDialog(user?: any) {
  userForm.value = user
    ? { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, password: '', group_name: user.group_name, role_id: user.role?.id ?? null, is_active: user.is_active ?? true }
    : { first_name: '', last_name: '', email: '', password: '', group_name: 'requester', role_id: null, is_active: true }
  userDialog.value = true
}

async function saveUser() {
  try {
    const payload: any = { ...userForm.value }
    if (!payload.password) delete payload.password
    if (!payload.role_id) delete payload.role_id
    await createUser({ payload })
    snackbar.show(userForm.value.id ? 'User updated' : `User created. A welcome email was sent to ${payload.email}`, 'success')
    userDialog.value = false
    refetchUsers()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteUser(id: string) {
  userToDelete.value = id
  userDeleteDialog.value = true
}

async function doDeleteUser() {
  try {
    await deleteUser({ id: userToDelete.value })
    snackbar.show('User deleted', 'success')
    refetchUsers()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    userDeleteDialog.value = false
  }
}

const userHeaders = [
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Email', key: 'email' },
  { title: 'Group', key: 'group_name' },
  { title: 'Role', key: 'role', sortable: false },
  { title: 'Status', key: 'is_active', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

// ─── Permissions Tab ──────────────────────────────────────────────────────────

const UPDATE_PERMISSION = gql`
  mutation updatePermission($payload: UpdatePermissionInput!) {
    updatePermission(payload: $payload) { id resource create read update delete }
  }
`

const { mutate: updatePermission, loading: savingPermission } = useMutation(UPDATE_PERMISSION)

const selectedRoleId = ref<string | null>(null)
const selectedRole = computed(() => roles.value.find((r: any) => r.id === selectedRoleId.value))

// From the Roles tab: open the permission grid on that role
function openPermissions(roleId: string) {
  refetchRoles()
  selectedRoleId.value = roleId
  setTab('permissions')
}

const resources = ['Dashboard', 'Requests', 'Inventory', 'Items', 'Locations', 'Vendors', 'Users', 'Roles', 'AuditLogs', 'Configurations']
const crudKeys = ['create', 'read', 'update', 'delete'] as const

type CrudKey = typeof crudKeys[number]

const permissionsLocal = ref<Record<string, Record<CrudKey, boolean>>>({})

watch(selectedRole, (role) => {
  if (!role) return
  const map: Record<string, Record<CrudKey, boolean>> = {}
  for (const perm of role.permissions ?? []) {
    map[perm.resource] = { create: perm.create ?? false, read: perm.read ?? false, update: perm.update ?? false, delete: perm.delete ?? false }
  }
  for (const res of resources) {
    if (!map[res]) map[res] = { create: false, read: false, update: false, delete: false }
  }
  permissionsLocal.value = map
})

function getPermId(resource: string): string | undefined {
  return selectedRole.value?.permissions?.find((p: any) => p.resource === resource)?.id
}

async function savePermissions() {
  if (!selectedRole.value) return
  try {
    await Promise.all(
      resources.map(async (resource) => {
        const id = getPermId(resource)
        if (!id) return
        await updatePermission({
          payload: {
            id,
            create: permissionsLocal.value[resource]?.create ?? false,
            read: permissionsLocal.value[resource]?.read ?? false,
            update: permissionsLocal.value[resource]?.update ?? false,
            delete: permissionsLocal.value[resource]?.delete ?? false,
          }
        })
      })
    )
    snackbar.show('Permissions saved', 'success')
    refetchRoles()
  } catch (e: any) {
    snackbar.error(e)
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">Roles & Permissions</h2>
      <RefreshButton />
    </div>

    <VTabs :model-value="tab" @update:model-value="setTab" class="mb-6">
      <VTab v-for="t in tabs" :key="t.value" :value="t.value">{{ t.label }}</VTab>
    </VTabs>

    <!-- ── Users Tab ───────────────────────────────────────────────────────── -->
    <template v-if="tab === 'users'">
      <VCard>
        <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
          <span>Users</span>
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openUserDialog()">Add User</VBtn>
        </VCardTitle>
        <VDivider />
        <VDataTable
          :headers="userHeaders"
          :items="users"
          :loading="usersLoading"
        >
          <template #item.name="{ item }">
            {{ item.first_name }} {{ item.last_name }}
          </template>
          <template #item.group_name="{ item }">
            <VChip size="x-small" variant="tonal" color="primary" class="text-capitalize">{{ item.group_name }}</VChip>
          </template>
          <template #item.role="{ item }">
            <span class="text-medium-emphasis">{{ item.role?.name ?? '—' }}</span>
          </template>
          <template #item.is_active="{ item }">
            <VChip size="x-small" :color="item.is_active ? 'success' : 'error'" variant="tonal">
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <VBtn icon variant="text" size="small" @click="openUserDialog(item)">
              <VIcon size="18">mdi-pencil-outline</VIcon>
            </VBtn>
            <VBtn icon variant="text" size="small" color="error" @click="confirmDeleteUser(item.id)">
              <VIcon size="18">mdi-delete-outline</VIcon>
            </VBtn>
          </template>
        </VDataTable>
      </VCard>

      <AppDialog
        v-model="userDialog"
        :title="userForm.id ? 'Edit User' : 'Add User'"
        :width="560"
        :loading="savingUser"
        :can-submit="strongPasswordValidator(() => userForm.email)(userForm.password) === true"
        @confirm="saveUser"
      >
        <VRow>
          <VCol cols="12" sm="6">
            <VTextField v-model="userForm.first_name" label="First Name" />
          </VCol>
          <VCol cols="12" sm="6">
            <VTextField v-model="userForm.last_name" label="Last Name" />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="userForm.email" label="Email" type="email" />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="userForm.password"
              :label="userForm.id ? 'New Password (optional)' : 'Password (optional)'"
              type="password"
              autocomplete="new-password"
              :rules="[strongPasswordValidator(() => userForm.email)]"
              :hint="userForm.id
                ? 'Leave blank to keep the current password.'
                : 'Leave blank and the user will get an email with a link to choose their own password.'"
              persistent-hint
            />
            <PasswordRequirements v-if="userForm.password" :password="userForm.password" />
          </VCol>
          <VCol cols="12" sm="6">
            <VSelect v-model="userForm.group_name" :items="groupOptions" label="Group" />
          </VCol>
          <VCol cols="12" sm="6">
            <VSelect v-model="userForm.role_id" :items="roleOptions" label="Role" clearable />
          </VCol>
          <VCol cols="12">
            <VSwitch v-model="userForm.is_active" label="Active" color="success" />
          </VCol>
        </VRow>
      </AppDialog>

      <ConfirmDialog
        v-model="userDeleteDialog"
        title="Delete User"
        question="Are you sure you want to delete this user?"
        confirm-text="Delete"
        :loading="deletingUser"
        @confirm="doDeleteUser"
      />
    </template>

    <!-- ── Roles Tab ───────────────────────────────────────────────────────── -->
    <RolesTable v-else-if="tab === 'roles'" @manage-permissions="openPermissions" />

    <!-- ── Permissions Tab ────────────────────────────────────────────────── -->
    <template v-else-if="tab === 'permissions'">
      <VRow>
        <VCol cols="12" md="3">
          <VCard>
            <VCardTitle class="pa-4 pb-2">Roles</VCardTitle>
            <VDivider />
            <VProgressLinear v-if="rolesLoading" indeterminate color="primary" />
            <VList density="compact" nav>
              <VListItem
                v-for="role in roles"
                :key="role.id"
                :value="role.id"
                :active="selectedRoleId === role.id"
                color="primary"
                rounded="lg"
                @click="selectedRoleId = role.id"
              >
                <VListItemTitle>{{ role.name }}</VListItemTitle>
                <VListItemSubtitle class="text-caption">{{ role.description }}</VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VCol>

        <VCol cols="12" md="9">
          <VCard>
            <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
              <span>{{ selectedRole?.name ?? 'Select a role' }} — Permissions</span>
              <VBtn
                v-if="selectedRole"
                color="primary"
                variant="flat"
                size="small"
                :loading="savingPermission"
                @click="savePermissions"
              >
                Save Permissions
              </VBtn>
            </VCardTitle>
            <VDivider />

            <VCardText v-if="!selectedRole" class="pa-6 text-center text-medium-emphasis">
              Select a role from the left to manage its permissions.
            </VCardText>

            <template v-else>
              <VTable density="compact" class="permissions-table">
                <thead>
                  <tr>
                    <th class="text-left" style="width: 180px">Resource</th>
                    <th v-for="key in crudKeys" :key="key" class="text-center">
                      {{ key.charAt(0).toUpperCase() + key.slice(1) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="resource in resources" :key="resource">
                    <td class="font-weight-medium">{{ resource }}</td>
                    <td v-for="key in crudKeys" :key="key" class="text-center">
                      <VCheckbox
                        v-if="permissionsLocal[resource]"
                        v-model="permissionsLocal[resource][key]"
                        density="compact"
                        class="d-inline-flex justify-center"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </template>
          </VCard>
        </VCol>
      </VRow>
    </template>
  </div>
</template>

<style scoped>
.permissions-table th,
.permissions-table td {
  padding: 8px 12px;
}
</style>
