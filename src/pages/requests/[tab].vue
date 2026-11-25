<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useAbility } from '@casl/vue'
import { useSnackbarStore } from '@/store/snackbar'
import { API_BASE } from '@/apollo-config/apiBase'
import { uploadFile } from '@/apollo-config/upload'
import RefreshButton from '@/components/RefreshButton.vue'
import AppDialog from '@/components/dialogs/AppDialog.vue'

const route = useRoute()
const router = useRouter()
const { can } = useAbility()

const activeTab = computed({
  get: () => route.params.tab as string || 'mine',
  set: (v) => router.push({ name: 'requests-tab', params: { tab: v } })
})

const userData = computed(() => {
  const s = localStorage.getItem('stockly_userData')
  return s ? JSON.parse(s) : null
})

const group = computed(() => userData.value?.group_name)
const canManage = computed(() => ['admin', 'operation', 'finance'].includes(group.value))

// ─── GQL ───────────────────────────────────────────────────────────────
const REQUEST_FIELDS = `
  id item_id item_name quantity unit_price total_price needed_by_date
  vendor_id location_id description invoice_1 invoice_2 invoice_3 purchase_invoice
  status rejection_note purchased_at createdAt
  item { id name } vendor { id name } location { id name }
  creator { id first_name last_name email }
  reviewer { id first_name last_name email }
  approver { id first_name last_name email }
  purchaser { id first_name last_name email }
  final_approver_id final_approved_at
  finalApprover { id first_name last_name email }
  final_approved_by finalApprovedBy { id first_name last_name email }
`

const REQUESTS_QUERY = gql`query requests($payload: RequestsQueryInput) { requests(payload: $payload) { ${REQUEST_FIELDS} } }`
const MY_REQUESTS_QUERY = gql`query myRequests { myRequests { ${REQUEST_FIELDS} } }`
const AWAITING_QUERY = gql`query requestsAwaitingMyApproval { requestsAwaitingMyApproval { ${REQUEST_FIELDS} } }`
const ITEMS_QUERY = gql`query items { items(payload: { approved: true }) { id name } }`
const REQUEST_NEW_ITEM_MUTATION = gql`mutation requestNewItem($payload: RequestNewItemInput!) { requestNewItem(payload: $payload) { id name is_approved } }`
const VENDORS_QUERY = gql`query vendors { vendors { id name } }`
const LOCATIONS_QUERY = gql`query locations { locations { id name parent_location { id name } } }`

const FORWARD_MUTATION = gql`mutation forwardRequest($id: ID!) { forwardRequest(id: $id) { id status } }`
const APPROVE_MUTATION = gql`mutation approveRequest($id: ID!) { approveRequest(id: $id) { id status } }`
const REJECT_MUTATION = gql`mutation rejectRequest($payload: RejectRequestInput!) { rejectRequest(payload: $payload) { id status } }`
const PURCHASE_MUTATION = gql`mutation markPurchased($id: ID!, $invoice: String!) { markPurchased(id: $id, invoice: $invoice) { id status purchase_invoice } }`
const CREATE_REQUEST_MUTATION = gql`mutation createRequest($payload: CreateRequestInput!) { createRequest(payload: $payload) { ${REQUEST_FIELDS} } }`

// ─── Manage tab ────────────────────────────────────────────────────────
const { result: allResult, loading: allLoading, refetch: refetchAll } = useQuery(REQUESTS_QUERY, {}, { enabled: canManage.value })
const allRequests = computed(() => allResult.value?.requests ?? [])

// ─── My Requests tab ───────────────────────────────────────────────────
const { result: myResult, loading: myLoading, refetch: refetchMine } = useQuery(MY_REQUESTS_QUERY)
const myRequests = computed(() => myResult.value?.myRequests ?? [])

// ─── Awaiting My Approval tab (final approver) ─────────────────────────
const { result: awaitingResult, loading: awaitingLoading, refetch: refetchAwaiting } = useQuery(AWAITING_QUERY)
const awaitingRequests = computed(() => awaitingResult.value?.requestsAwaitingMyApproval ?? [])
const showAwaitingTab = computed(() => awaitingRequests.value.length > 0 || activeTab.value === 'awaiting')

// ─── Form data ─────────────────────────────────────────────────────────
const { result: itemsResult } = useQuery(ITEMS_QUERY)
const { result: vendorsResult } = useQuery(VENDORS_QUERY)
const { result: locationsResult } = useQuery(LOCATIONS_QUERY)
// Items the user created from this form; pending approval, so not returned by ITEMS_QUERY
const pendingItems = ref<{ id: string; name: string; is_approved: boolean }[]>([])
const items = computed(() => [...pendingItems.value, ...(itemsResult.value?.items ?? [])])
const vendors = computed(() => vendorsResult.value?.vendors ?? [])
const locations = computed(() => {
  return (locationsResult.value?.locations ?? []).map((l: any) => ({
    ...l,
    displayName: l.parent_location ? `${l.parent_location.name} / ${l.name}` : l.name
  }))
})

// ─── Mutations ──────────────────────────────────────────────────────────
const { mutate: forwardMutate } = useMutation(FORWARD_MUTATION)
const { mutate: approveMutate } = useMutation(APPROVE_MUTATION)
const { mutate: rejectMutate } = useMutation(REJECT_MUTATION)
const { mutate: purchaseMutate, loading: purchasing } = useMutation(PURCHASE_MUTATION)
const { mutate: createMutate, loading: creating } = useMutation(CREATE_REQUEST_MUTATION)

const actionLoading = ref<string | null>(null)
const snackbar = useSnackbarStore()

const doAction = async (action: string, id: string, extra?: any) => {
  actionLoading.value = `${action}-${id}`
  try {
    if (action === 'forward') {
      await forwardMutate({ id })
      snackbar.success('Request forwarded to finance')
    }
    if (action === 'approve') {
      const res = await approveMutate({ id })
      snackbar.success(res?.data?.approveRequest?.status === 'awaiting_final_approval'
        ? 'Approved — sent for final approval'
        : 'Request approved')
    }
    if (action === 'reject') {
      await rejectMutate({ payload: { id, rejection_note: extra } })
      snackbar.success('Request rejected')
    }
    refetchAll()
    refetchMine()
    refetchAwaiting()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    actionLoading.value = null
  }
}

// ─── Reject dialog ──────────────────────────────────────────────────────
const rejectDialog = ref(false)
const rejectNote = ref('')
const rejectTargetId = ref('')
const openRejectDialog = (id: string) => { rejectTargetId.value = id; rejectNote.value = ''; rejectDialog.value = true }
const confirmReject = async () => { rejectDialog.value = false; await doAction('reject', rejectTargetId.value, rejectNote.value) }

// ─── New Request form ───────────────────────────────────────────────────
const requestDialog = ref(false)
const requestForm = ref()
const emptyRequest = () => ({
  item_id: null as string | null,
  item_name: '',
  quantity: 1,
  unit_price: 0,
  needed_by_date: '',
  vendor_id: null as string | null,
  location_id: null as string | null,
  description: ''
})
const newRequest = ref(emptyRequest())
const quotationFiles = ref<File[] | File | null>(null)
const submittingRequest = ref(false)
const openRequestDialog = () => { newRequest.value = emptyRequest(); quotationFiles.value = null; requestDialog.value = true }

// VFileInput may give a single File or an array depending on `multiple`
const toFiles = (v: File[] | File | null | undefined): File[] => (Array.isArray(v) ? v : v ? [v] : [])
const maxThreeFiles = (v: File[] | File | null) => toFiles(v).length <= 3 || 'You can attach up to 3 quotations'

const onItemSelect = (id: string) => {
  const item = items.value.find((i: any) => i.id === id)
  if (item) newRequest.value.item_name = item.name
}

// ─── New Item (pending approval) ────────────────────────────────────────
const { mutate: requestNewItemMutate, loading: creatingItem } = useMutation(REQUEST_NEW_ITEM_MUTATION)
const itemSearch = ref('')
const newItemDialog = ref(false)
const newItem = ref({ name: '', description: '' })

const openNewItemDialog = () => {
  newItem.value = { name: itemSearch.value?.trim() ?? '', description: '' }
  newItemDialog.value = true
}

const submitNewItem = async () => {
  if (!newItem.value.name.trim()) return
  try {
    const res = await requestNewItemMutate({ payload: { name: newItem.value.name.trim(), description: newItem.value.description || undefined } })
    const created = res?.data?.requestNewItem
    if (!created) return
    pendingItems.value.unshift(created)
    newRequest.value.item_id = created.id
    newRequest.value.item_name = created.name
    newItemDialog.value = false
    snackbar.success('Item submitted for approval')
  } catch (e: any) {
    snackbar.error(e)
  }
}

const submitRequest = async () => {
  if (!requestForm.value) return
  const { valid } = await requestForm.value.validate()
  if (!valid) return
  submittingRequest.value = true
  try {
    const [invoice_1, invoice_2, invoice_3] = await Promise.all(toFiles(quotationFiles.value).map(uploadFile))
    await createMutate({
      payload: {
        ...newRequest.value,
        invoice_1: invoice_1 ?? null,
        invoice_2: invoice_2 ?? null,
        invoice_3: invoice_3 ?? null,
        item_id: newRequest.value.item_id || null,
        vendor_id: newRequest.value.vendor_id || null,
        location_id: newRequest.value.location_id || null,
        quantity: Number(newRequest.value.quantity),
        unit_price: Number(newRequest.value.unit_price)
      }
    })
    requestDialog.value = false
    snackbar.success('Request submitted successfully')
    refetchMine()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    submittingRequest.value = false
  }
}

// ─── Mark as Purchased dialog (invoice required) ────────────────────────
const purchaseDialog = ref(false)
const purchaseTarget = ref<any>(null)
const purchaseInvoice = ref<File[] | File | null>(null)
const uploadingInvoice = ref(false)

const openPurchaseDialog = (req: any) => {
  purchaseTarget.value = req
  purchaseInvoice.value = null
  purchaseDialog.value = true
}

const confirmPurchase = async () => {
  const file = toFiles(purchaseInvoice.value)[0]
  if (!file || !purchaseTarget.value) return
  uploadingInvoice.value = true
  try {
    const invoice = await uploadFile(file)
    await purchaseMutate({ id: purchaseTarget.value.id, invoice })
    purchaseDialog.value = false
    snackbar.success('Marked as purchased')
    refetchAll()
    refetchMine()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    uploadingInvoice.value = false
  }
}

// ─── Detail drawer ──────────────────────────────────────────────────────
const detailDrawer = ref(false)
const selectedRequest = ref<any>(null)
const openDetail = (req: any) => { selectedRequest.value = req; detailDrawer.value = true }

// ─── Tables ─────────────────────────────────────────────────────────────
const manageHeaders = [
  { title: 'Item', key: 'item_name' },
  { title: 'Qty', key: 'quantity' },
  { title: 'Unit Price', key: 'unit_price' },
  { title: 'Total', key: 'total_price' },
  { title: 'Needed By', key: 'needed_by_date' },
  { title: 'Status', key: 'status' },
  { title: 'Files', key: 'files', sortable: false, align: 'center' as const },
  { title: 'Requested By', key: 'creator', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]

const statusColor = (status: string) => ({
  pending: 'warning', forwarded: 'info', awaiting_final_approval: 'deep-purple', approved: 'success',
  rejected: 'error', purchased: 'primary'
}[status] || 'default')

const statusLabel = (status: string) => status === 'awaiting_final_approval' ? 'Awaiting final approval' : status

// ─── Status filters (client-side; each tab already has its full list) ───
const STATUSES = ['pending', 'forwarded', 'awaiting_final_approval', 'approved', 'rejected', 'purchased']
const manageStatus = ref('all')
const myStatus = ref('all')

const byStatus = (list: any[], status: string) => (status === 'all' ? list : list.filter((r: any) => r.status === status))
const filteredAllRequests = computed(() => byStatus(allRequests.value, manageStatus.value))
const filteredMyRequests = computed(() => byStatus(myRequests.value, myStatus.value))

// Options with counts; statuses with no requests are hidden unless currently selected
const statusOptions = (list: any[], selected: string) => [
  { title: `All statuses (${list.length})`, value: 'all' },
  ...STATUSES
    .map(s => ({ status: s, count: list.filter((r: any) => r.status === s).length }))
    .filter(o => o.count > 0 || o.status === selected)
    .map(o => {
      const label = statusLabel(o.status)
      return { title: `${label.charAt(0).toUpperCase()}${label.slice(1)} (${o.count})`, value: o.status }
    }),
]
const manageStatusOptions = computed(() => statusOptions(allRequests.value, manageStatus.value))
const myStatusOptions = computed(() => statusOptions(myRequests.value, myStatus.value))

// Attached documents: up to 3 quotations (at creation) + the purchase invoice (at Mark Purchased)
const quotationCount = (r: any) => [r.invoice_1, r.invoice_2, r.invoice_3].filter(Boolean).length
const fileCount = (r: any) => quotationCount(r) + (r.purchase_invoice ? 1 : 0)
const fileTooltip = (r: any) => {
  const q = quotationCount(r)
  return [q ? `${q} quotation${q > 1 ? 's' : ''}` : '', r.purchase_invoice ? 'purchase invoice' : ''].filter(Boolean).join(' · ')
}

const awaitingHeaders = [
  ...manageHeaders.filter(h => h.key !== 'status' && h.key !== 'actions'),
  { title: 'Finance Approval By', key: 'approver', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]
</script>

<template>
  <div>

    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 font-weight-bold">Requests</h2>
      <RefreshButton />
    </div>

    <!-- Tabs -->
    <VTabs v-model="activeTab" class="mb-4">
      <VTab v-if="canManage" value="manage">Manage</VTab>
      <VTab v-if="showAwaitingTab" value="awaiting">
        Awaiting My Approval
        <VChip v-if="awaitingRequests.length" size="x-small" color="deep-purple" class="ms-2">{{ awaitingRequests.length }}</VChip>
      </VTab>
      <VTab value="mine">My Requests</VTab>
    </VTabs>

    <VWindow v-model="activeTab">
      <!-- MANAGE TAB -->
      <VWindowItem value="manage">
        <div class="d-flex align-center ga-4 mb-3">
          <VSelect
            v-model="manageStatus"
            :items="manageStatusOptions"
            prepend-inner-icon="mdi-filter-variant"
            style="max-width: 280px"
          >
            <template #item="{ props: optProps, item: opt }">
              <VListItem v-bind="optProps">
                <template #prepend>
                  <VIcon v-if="opt.value !== 'all'" :color="statusColor(opt.value)" size="10" class="me-2">mdi-circle</VIcon>
                  <VIcon v-else size="16" class="me-1">mdi-format-list-bulleted</VIcon>
                </template>
              </VListItem>
            </template>
            <template #selection="{ item: opt }">
              <VIcon v-if="opt.value !== 'all'" :color="statusColor(opt.value)" size="10" class="me-2">mdi-circle</VIcon>
              <span class="text-capitalize">{{ opt.title }}</span>
            </template>
          </VSelect>
        </div>
        <VCard>
          <VDataTable
            :headers="manageHeaders"
            :items="filteredAllRequests"
            :loading="allLoading"
            class="text-no-wrap"
            @click:row="(_, { item }) => openDetail(item)"
          >
            <template #item.unit_price="{ item }">GHS {{ Number(item.unit_price).toFixed(2) }}</template>
            <template #item.total_price="{ item }">GHS {{ Number(item.total_price).toFixed(2) }}</template>
            <template #item.files="{ item }">
              <VTooltip v-if="fileCount(item)" location="top">
                <template #activator="{ props: tipProps }">
                  <VChip v-bind="tipProps" size="small" variant="tonal" color="warning" prepend-icon="mdi-paperclip">
                    {{ fileCount(item) }}
                  </VChip>
                </template>
                {{ fileTooltip(item) }}
              </VTooltip>
              <span v-else class="text-medium-emphasis">—</span>
            </template>
            <template #item.needed_by_date="{ item }">{{ item.needed_by_date ? new Date(item.needed_by_date).toLocaleDateString() : '—' }}</template>
            <template #no-data>
              <div class="pa-4 text-medium-emphasis">{{ manageStatus !== 'all' ? 'No requests with this status' : 'No requests yet' }}</div>
            </template>
            <template #item.status="{ item }">
              <VChip :color="statusColor(item.status)" size="small" variant="tonal" class="text-capitalize">{{ statusLabel(item.status) }}</VChip>
            </template>
            <template #item.creator="{ item }">
              {{ item.creator ? `${item.creator.first_name} ${item.creator.last_name}` : '—' }}
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex ga-1" @click.stop>
                <!-- Operation: Forward pending -->
                <VBtn
                  v-if="item.status === 'pending' && ['admin', 'operation'].includes(group)"
                  size="x-small" color="info" variant="tonal"
                  :loading="actionLoading === `forward-${item.id}`"
                  @click="doAction('forward', item.id)"
                >Forward</VBtn>

                <!-- Finance: Approve forwarded -->
                <VBtn
                  v-if="(item.status === 'forwarded' && ['admin', 'finance'].includes(group)) || (item.status === 'awaiting_final_approval' && group === 'admin')"
                  size="x-small" color="success" variant="tonal"
                  :loading="actionLoading === `approve-${item.id}`"
                  @click="doAction('approve', item.id)"
                >Approve</VBtn>

                <!-- Reject: operation (pending), finance (forwarded), admin (also awaiting final approval) -->
                <VBtn
                  v-if="(item.status === 'pending' && ['admin', 'operation'].includes(group)) || (item.status === 'forwarded' && ['admin', 'finance'].includes(group)) || (item.status === 'awaiting_final_approval' && group === 'admin')"
                  size="x-small" color="error" variant="tonal"
                  @click="openRejectDialog(item.id)"
                >Reject</VBtn>

                <!-- Mark Purchased: approved -->
                <VBtn
                  v-if="item.status === 'approved' && ['admin', 'operation', 'finance'].includes(group)"
                  size="x-small" color="primary" variant="tonal"
                  @click="openPurchaseDialog(item)"
                >Purchase</VBtn>
              </div>
            </template>
          </VDataTable>
        </VCard>
      </VWindowItem>

      <!-- AWAITING MY APPROVAL TAB -->
      <VWindowItem value="awaiting">
        <VAlert type="info" variant="tonal" density="compact" class="mb-3">
          These requests have been approved by finance and, based on their amount, need your final approval.
        </VAlert>
        <VCard>
          <VDataTable
            :headers="awaitingHeaders"
            :items="awaitingRequests"
            :loading="awaitingLoading"
            class="text-no-wrap"
            @click:row="(_, { item }) => openDetail(item)"
          >
            <template #item.unit_price="{ item }">GHS {{ Number(item.unit_price).toFixed(2) }}</template>
            <template #item.total_price="{ item }">GHS {{ Number(item.total_price).toFixed(2) }}</template>
            <template #item.files="{ item }">
              <VTooltip v-if="fileCount(item)" location="top">
                <template #activator="{ props: tipProps }">
                  <VChip v-bind="tipProps" size="small" variant="tonal" color="warning" prepend-icon="mdi-paperclip">
                    {{ fileCount(item) }}
                  </VChip>
                </template>
                {{ fileTooltip(item) }}
              </VTooltip>
              <span v-else class="text-medium-emphasis">—</span>
            </template>
            <template #item.needed_by_date="{ item }">{{ item.needed_by_date ? new Date(item.needed_by_date).toLocaleDateString() : '—' }}</template>
            <template #item.creator="{ item }">
              {{ item.creator ? `${item.creator.first_name} ${item.creator.last_name}` : '—' }}
            </template>
            <template #item.approver="{ item }">
              {{ item.approver ? `${item.approver.first_name} ${item.approver.last_name}` : '—' }}
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex ga-1" @click.stop>
                <VBtn
                  size="x-small" color="success" variant="tonal"
                  :loading="actionLoading === `approve-${item.id}`"
                  @click="doAction('approve', item.id)"
                >Approve</VBtn>
                <VBtn size="x-small" color="error" variant="tonal" @click="openRejectDialog(item.id)">Reject</VBtn>
              </div>
            </template>
            <template #no-data>
              <div class="pa-4 text-medium-emphasis">Nothing is waiting for your approval.</div>
            </template>
          </VDataTable>
        </VCard>
      </VWindowItem>

      <!-- MY REQUESTS TAB -->
      <VWindowItem value="mine">
        <div class="d-flex align-center justify-space-between ga-4 mb-3">
          <VSelect
            v-model="myStatus"
            :items="myStatusOptions"
            prepend-inner-icon="mdi-filter-variant"
            style="max-width: 280px"
          >
            <template #item="{ props: optProps, item: opt }">
              <VListItem v-bind="optProps">
                <template #prepend>
                  <VIcon v-if="opt.value !== 'all'" :color="statusColor(opt.value)" size="10" class="me-2">mdi-circle</VIcon>
                  <VIcon v-else size="16" class="me-1">mdi-format-list-bulleted</VIcon>
                </template>
              </VListItem>
            </template>
            <template #selection="{ item: opt }">
              <VIcon v-if="opt.value !== 'all'" :color="statusColor(opt.value)" size="10" class="me-2">mdi-circle</VIcon>
              <span class="text-capitalize">{{ opt.title }}</span>
            </template>
          </VSelect>
          <VBtn prepend-icon="mdi-plus" @click="openRequestDialog">New Request</VBtn>
        </div>
        <VCard>
          <VDataTable
            :headers="manageHeaders.filter(h => h.key !== 'actions' && h.key !== 'creator')"
            :items="filteredMyRequests"
            :loading="myLoading"
            class="text-no-wrap"
            @click:row="(_, { item }) => openDetail(item)"
          >
            <template #item.unit_price="{ item }">GHS {{ Number(item.unit_price).toFixed(2) }}</template>
            <template #item.total_price="{ item }">GHS {{ Number(item.total_price).toFixed(2) }}</template>
            <template #item.files="{ item }">
              <VTooltip v-if="fileCount(item)" location="top">
                <template #activator="{ props: tipProps }">
                  <VChip v-bind="tipProps" size="small" variant="tonal" color="warning" prepend-icon="mdi-paperclip">
                    {{ fileCount(item) }}
                  </VChip>
                </template>
                {{ fileTooltip(item) }}
              </VTooltip>
              <span v-else class="text-medium-emphasis">—</span>
            </template>
            <template #item.needed_by_date="{ item }">{{ item.needed_by_date ? new Date(item.needed_by_date).toLocaleDateString() : '—' }}</template>
            <template #no-data>
              <div class="pa-4 text-medium-emphasis">{{ myStatus !== 'all' ? 'No requests with this status' : 'No requests yet' }}</div>
            </template>
            <template #item.status="{ item }">
              <VChip :color="statusColor(item.status)" size="small" variant="tonal" class="text-capitalize">{{ statusLabel(item.status) }}</VChip>
            </template>
          </VDataTable>
        </VCard>
      </VWindowItem>
    </VWindow>

    <!-- Mark as Purchased Dialog -->
    <AppDialog
      v-model="purchaseDialog"
      title="Mark as Purchased"
      :width="460"
      confirm-text="Confirm Purchase"
      :loading="uploadingInvoice || purchasing"
      :can-submit="!!toFiles(purchaseInvoice).length"
      @confirm="confirmPurchase"
    >
      <template v-if="purchaseTarget">
        <p class="text-body-1 mb-1"><strong>{{ purchaseTarget.item_name }}</strong> × {{ purchaseTarget.quantity }}</p>
        <p class="text-body-2 text-medium-emphasis mb-4">Total: GHS {{ Number(purchaseTarget.total_price).toFixed(2) }}</p>
        <VFileInput
          v-model="purchaseInvoice"
          label="Invoice / receipt *"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          show-size
          prepend-icon=""
          prepend-inner-icon="mdi-receipt-text-outline"
          hint="Required. PDF or image, max 10 MB. Attached to the inventory record."
          persistent-hint
        />
      </template>
    </AppDialog>

    <!-- Reject Dialog -->
    <AppDialog
      v-model="rejectDialog"
      title="Reject Request"
      :width="460"
      confirm-text="Reject"
      confirm-color="error"
      @confirm="confirmReject"
    >
      <VTextarea v-model="rejectNote" label="Reason for rejection" rows="3" />
    </AppDialog>

    <!-- New Request Dialog -->
    <AppDialog
      v-model="requestDialog"
      title="New Purchase Request"
      :width="640"
      confirm-text="Submit"
      :loading="creating || submittingRequest"
      @confirm="submitRequest"
    >
      <VForm ref="requestForm">
        <VRow>
          <VCol cols="12">
            <VAutocomplete
              v-model="newRequest.item_id"
              v-model:search="itemSearch"
              :items="items"
              item-title="name"
              item-value="id"
              label="Item"
              hide-details="auto"
              @update:model-value="onItemSelect"
            >
              <template #item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps">
                  <template v-if="(item.raw as any).is_approved === false" #append>
                    <VChip size="x-small" color="warning" variant="tonal">Pending approval</VChip>
                  </template>
                </VListItem>
              </template>
              <template #no-data>
                <VListItem @click="openNewItemDialog">
                  <template #prepend><VIcon color="primary">mdi-plus</VIcon></template>
                  <VListItemTitle>
                    Can't find it? Create <strong>“{{ itemSearch }}”</strong>
                  </VListItemTitle>
                </VListItem>
              </template>
            </VAutocomplete>
            <div class="d-flex justify-end mt-1">
              <VBtn variant="text" size="small" prepend-icon="mdi-plus" @click="openNewItemDialog">New item</VBtn>
            </div>
          </VCol>
          <!-- <VCol cols="12">
            <VTextField v-model="newRequest.item_name" label="Item Name *" :rules="[v => !!v || 'Required']" />
          </VCol> -->
          <VCol cols="6">
            <VTextField v-model.number="newRequest.quantity" label="Quantity *" type="number" :rules="[v => v > 0 || 'Quantity must be greater than 0']" />
          </VCol>
          <VCol cols="6">
            <VTextField v-model.number="newRequest.unit_price" label="Unit Price (GHS) *" type="number" :rules="[v => v > 0 || 'Price must be greater than 0']" />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="newRequest.needed_by_date" label="Needed By *" type="date" :rules="[v => !!v || 'Required']" />
          </VCol>
          <VCol cols="6">
            <VSelect v-model="newRequest.vendor_id" :items="vendors" item-title="name" item-value="id" label="Vendor (optional)" clearable />
          </VCol>
          <VCol cols="6">
            <VSelect v-model="newRequest.location_id" :items="locations" item-title="displayName" item-value="id" label="Location (optional)" clearable />
          </VCol>
          <VCol cols="12">
            <VTextarea v-model="newRequest.description" label="Description" rows="2" />
          </VCol>
          <VCol cols="12">
            <VFileInput
              v-model="quotationFiles"
              label="Quotations (optional, up to 3)"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              multiple
              chips
              counter
              show-size
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
              hint="PDF or image, max 10 MB each"
              persistent-hint
              :rules="[maxThreeFiles]"
            />
          </VCol>
        </VRow>
      </VForm>
    </AppDialog>

    <!-- New Item Dialog -->
    <AppDialog
      v-model="newItemDialog"
      title="New Item"
      subtitle="Sent to an administrator for approval"
      :width="460"
      confirm-text="Create Item"
      :loading="creatingItem"
      :can-submit="!!newItem.name.trim()"
      @confirm="submitNewItem"
    >
      <p class="text-body-2 text-medium-emphasis mb-4">
        The item will be added to your request right away and sent to an administrator for approval before it appears in the item list for others.
      </p>
      <VTextField v-model="newItem.name" label="Item Name *" class="mb-4" autofocus />
      <VTextarea v-model="newItem.description" label="Description" rows="2" />
    </AppDialog>

    <!-- Detail Drawer -->
    <VNavigationDrawer v-model="detailDrawer" location="right" width="420" temporary>
      <VCard v-if="selectedRequest" flat>
        <VCardTitle class="pa-4 d-flex justify-space-between align-center">
          Request Detail
          <VBtn icon="mdi-close" variant="text" @click="detailDrawer = false" />
        </VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <VChip :color="statusColor(selectedRequest.status)" class="mb-4 text-capitalize" variant="tonal">{{ statusLabel(selectedRequest.status) }}</VChip>

          <VList density="compact">
            <VListItem title="Item" :subtitle="selectedRequest.item_name" />
            <VListItem title="Quantity" :subtitle="String(selectedRequest.quantity)" />
            <VListItem title="Unit Price" :subtitle="`GHS ${Number(selectedRequest.unit_price).toFixed(2)}`" />
            <VListItem title="Total" :subtitle="`GHS ${Number(selectedRequest.total_price).toFixed(2)}`" />
            <VListItem title="Needed By" :subtitle="selectedRequest.needed_by_date ? new Date(selectedRequest.needed_by_date).toLocaleDateString() : '—'" />
            <VListItem title="Vendor" :subtitle="selectedRequest.vendor?.name ?? '—'" />
            <VListItem title="Location" :subtitle="selectedRequest.location?.name ?? '—'" />
            <VListItem title="Description" :subtitle="selectedRequest.description ?? '—'" />
            <VDivider class="my-2" />
            <VListItem title="Requested By" :subtitle="selectedRequest.creator ? `${selectedRequest.creator.first_name} ${selectedRequest.creator.last_name}` : '—'" />
            <VListItem v-if="selectedRequest.reviewer" title="Reviewed By" :subtitle="`${selectedRequest.reviewer.first_name} ${selectedRequest.reviewer.last_name}`" />
            <VListItem v-if="selectedRequest.approver" :title="selectedRequest.final_approver_id ? 'Finance Approval By' : 'Approved By'" :subtitle="`${selectedRequest.approver.first_name} ${selectedRequest.approver.last_name}`" />
            <VListItem
              v-if="selectedRequest.finalApprovedBy || selectedRequest.finalApprover"
              title="Final Approval"
              :subtitle="selectedRequest.final_approved_at
                ? `${(selectedRequest.finalApprovedBy ?? selectedRequest.finalApprover).first_name} ${(selectedRequest.finalApprovedBy ?? selectedRequest.finalApprover).last_name} · approved ${new Date(selectedRequest.final_approved_at).toLocaleDateString()}`
                : `${selectedRequest.finalApprover.first_name} ${selectedRequest.finalApprover.last_name} · pending`"
            />
            <VListItem v-if="selectedRequest.purchaser" title="Purchased By" :subtitle="`${selectedRequest.purchaser.first_name} ${selectedRequest.purchaser.last_name}`" />
            <VListItem v-if="selectedRequest.rejection_note" title="Rejection Note" :subtitle="selectedRequest.rejection_note" />
          </VList>

          <!-- Purchase invoice -->
          <div v-if="selectedRequest.purchase_invoice" class="mt-4">
            <p class="text-body-2 font-weight-medium mb-2">Purchase Invoice</p>
            <VBtn variant="tonal" size="small" color="primary" prepend-icon="mdi-receipt-text-outline" :href="`${API_BASE}/${selectedRequest.purchase_invoice}`" target="_blank">View invoice</VBtn>
          </div>

          <!-- Quotations -->
          <div v-if="selectedRequest.invoice_1 || selectedRequest.invoice_2 || selectedRequest.invoice_3" class="mt-4">
            <p class="text-body-2 font-weight-medium mb-2">Quotations</p>
            <div class="d-flex flex-column ga-2">
              <VBtn v-if="selectedRequest.invoice_1" variant="tonal" size="small" prepend-icon="mdi-file-document" :href="`${API_BASE}/${selectedRequest.invoice_1}`" target="_blank">Quotation 1</VBtn>
              <VBtn v-if="selectedRequest.invoice_2" variant="tonal" size="small" prepend-icon="mdi-file-document" :href="`${API_BASE}/${selectedRequest.invoice_2}`" target="_blank">Quotation 2</VBtn>
              <VBtn v-if="selectedRequest.invoice_3" variant="tonal" size="small" prepend-icon="mdi-file-document" :href="`${API_BASE}/${selectedRequest.invoice_3}`" target="_blank">Quotation 3</VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VNavigationDrawer>
  </div>
</template>
