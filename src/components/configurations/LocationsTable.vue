<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const snackbar = useSnackbarStore()

const LOCATIONS_QUERY = gql`
  query locations($payload: LocationsQueryInput) {
    locations(payload: $payload) {
      id name parent_id createdAt
      parent_location { id name }
    }
  }
`
const CREATE_LOCATION = gql`
  mutation createLocation($payload: CreateLocationInput!) {
    createLocation(payload: $payload) { id name parent_id createdAt parent_location { id name } }
  }
`
const DELETE_LOCATION = gql`
  mutation deleteLocation($id: ID!) { deleteLocation(id: $id) }
`

const locationSearch = ref('')
const { result: locationsResult, loading: locationsLoading, refetch: refetchLocations } = useQuery(LOCATIONS_QUERY, () => ({ payload: { q: locationSearch.value || undefined } }), { debounce: 300 })
const locations = computed(() => locationsResult.value?.locations ?? [])

const locationDialog = ref(false)
const locationDeleteDialog = ref(false)
const locationForm = ref<{ id?: string; name: string; parent_id: string | null }>({ name: '', parent_id: null })
const locationToDelete = ref<string | null>(null)

const { mutate: createLocation, loading: savingLocation } = useMutation(CREATE_LOCATION)
const { mutate: deleteLocation, loading: deletingLocation } = useMutation(DELETE_LOCATION)

function openLocationDialog(loc?: any) {
  locationForm.value = loc ? { id: loc.id, name: loc.name, parent_id: loc.parent_id ?? null } : { name: '', parent_id: null }
  locationDialog.value = true
}

async function saveLocation() {
  try {
    await createLocation({ payload: { ...locationForm.value, parent_id: locationForm.value.parent_id || undefined } })
    snackbar.show(locationForm.value.id ? 'Location updated' : 'Location created', 'success')
    locationDialog.value = false
    refetchLocations()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteLocation(id: string) {
  locationToDelete.value = id
  locationDeleteDialog.value = true
}

async function doDeleteLocation() {
  try {
    await deleteLocation({ id: locationToDelete.value })
    snackbar.show('Location deleted', 'success')
    refetchLocations()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    locationDeleteDialog.value = false
  }
}

const locationHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Parent Location', key: 'parent_location' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const parentLocationOptions = computed(() =>
  locations.value
    .filter((l: any) => l.id !== locationForm.value.id)
    .map((l: any) => ({ title: l.name, value: l.id }))
)
</script>

<template>
    <VCard>
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Locations</span>
        <div class="d-flex ga-4 align-center">
          <VTextField
            v-model="locationSearch"
            placeholder="Search locations..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 220px"
          />
          <VBtn color="primary" prepend-icon="mdi-plus" @click="openLocationDialog()">Add Location</VBtn>
        </div>
      </VCardTitle>
      <VDivider />
      <VDataTable
        :headers="locationHeaders"
        :items="locations"
        :loading="locationsLoading"
      >
        <template #item.parent_location="{ item }">
          <span class="text-medium-emphasis">{{ item.parent_location?.name ?? '—' }}</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—' }}
        </template>
        <template #item.actions="{ item }">
          <VBtn icon variant="text" size="small" @click="openLocationDialog(item)">
            <VIcon size="18">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon variant="text" size="small" color="error" @click="confirmDeleteLocation(item.id)">
            <VIcon size="18">mdi-delete-outline</VIcon>
          </VBtn>
        </template>
      </VDataTable>
    </VCard>

    <AppDialog
      v-model="locationDialog"
      :title="locationForm.id ? 'Edit Location' : 'Add Location'"
      :loading="savingLocation"
      @confirm="saveLocation"
    >
      <VTextField v-model="locationForm.name" label="Name" class="mb-4" />
      <VSelect
        v-model="locationForm.parent_id"
        :items="parentLocationOptions"
        label="Parent Location (optional)"
        clearable
      />
    </AppDialog>

    <ConfirmDialog
      v-model="locationDeleteDialog"
      title="Delete Location"
      question="Are you sure you want to delete this location?"
      confirm-text="Delete"
      :loading="deletingLocation"
      @confirm="doDeleteLocation"
    />
</template>
