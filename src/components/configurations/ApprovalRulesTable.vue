<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useSnackbarStore } from '@/store/snackbar'
import AppDialog from '@/components/dialogs/AppDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const snackbar = useSnackbarStore()

const RULE_FIELDS = 'id min_amount max_amount approver_id is_active approver { id first_name last_name email }'
const APPROVAL_RULES_QUERY = gql`query approvalRules { approvalRules { ${RULE_FIELDS} } }`
const CREATE_APPROVAL_RULE = gql`
  mutation createApprovalRule($payload: CreateApprovalRuleInput!) { createApprovalRule(payload: $payload) { ${RULE_FIELDS} } }
`
const DELETE_APPROVAL_RULE = gql`mutation deleteApprovalRule($id: ID!) { deleteApprovalRule(id: $id) }`
const APPROVER_USERS_QUERY = gql`query users { users { id first_name last_name email is_active } }`

const { result: rulesResult, loading: rulesLoading, refetch: refetchRules } = useQuery(APPROVAL_RULES_QUERY)
const rules = computed(() => rulesResult.value?.approvalRules ?? [])
const { result: approverUsersResult } = useQuery(APPROVER_USERS_QUERY)
const approverOptions = computed(() =>
  (approverUsersResult.value?.users ?? [])
    .filter((u: any) => u.is_active)
    .map((u: any) => ({ title: `${u.first_name} ${u.last_name} (${u.email})`, value: u.id })),
)

type RuleForm = { id?: string; min_amount: number | null; max_amount: number | null; approver_id: string | null; is_active: boolean }
const ruleDialog = ref(false)
const ruleDeleteDialog = ref(false)
const ruleForm = ref<RuleForm>({ min_amount: null, max_amount: null, approver_id: null, is_active: true })
const ruleToDelete = ref<string | null>(null)

const { mutate: createApprovalRule, loading: savingRule } = useMutation(CREATE_APPROVAL_RULE)
const { mutate: deleteApprovalRule, loading: deletingRule } = useMutation(DELETE_APPROVAL_RULE)

const formatGhs = (n: number | null) => (n === null || n === undefined ? 'No limit' : `GHS ${Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`)

function openRuleDialog(rule?: any) {
  ruleForm.value = rule
    ? { id: rule.id, min_amount: rule.min_amount, max_amount: rule.max_amount, approver_id: rule.approver_id, is_active: rule.is_active }
    : { min_amount: null, max_amount: null, approver_id: null, is_active: true }
  ruleDialog.value = true
}

async function saveRule() {
  const f = ruleForm.value
  if (f.min_amount === null || (f.min_amount as any) === '' || !f.approver_id) {
    snackbar.show('Minimum amount and approver are required', 'error')
    return
  }
  const max = f.max_amount === null || (f.max_amount as any) === '' ? null : Number(f.max_amount)
  try {
    await createApprovalRule({
      payload: { id: f.id, min_amount: Number(f.min_amount), max_amount: max, approver_id: f.approver_id, is_active: f.is_active },
    })
    snackbar.show(f.id ? 'Approval rule updated' : 'Approval rule created', 'success')
    ruleDialog.value = false
    refetchRules()
  } catch (e: any) {
    snackbar.error(e)
  }
}

function confirmDeleteRule(id: string) {
  ruleToDelete.value = id
  ruleDeleteDialog.value = true
}

async function doDeleteRule() {
  try {
    await deleteApprovalRule({ id: ruleToDelete.value })
    snackbar.show('Approval rule deleted', 'success')
    refetchRules()
  } catch (e: any) {
    snackbar.error(e)
  } finally {
    ruleDeleteDialog.value = false
  }
}

const ruleHeaders = [
  { title: 'From', key: 'min_amount' },
  { title: 'Up To', key: 'max_amount' },
  { title: 'Final Approver', key: 'approver', sortable: false },
  { title: 'Status', key: 'is_active' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<template>
    <VCard>
      <VCardTitle class="pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Approval Rules</span>
        <VBtn color="primary" prepend-icon="mdi-plus" @click="openRuleDialog()">Add Rule</VBtn>
      </VCardTitle>
      <VCardText class="pt-0 text-body-2 text-medium-emphasis">
        After finance approves a request, if its total (unit price × quantity) falls within a rule's range,
        it needs a final approval from that rule's approver. "Up to" is exclusive; leave it empty for no upper limit.
      </VCardText>
      <VDivider />
      <VDataTable :headers="ruleHeaders" :items="rules" :loading="rulesLoading">
        <template #item.min_amount="{ item }">{{ formatGhs((item as any).min_amount) }}</template>
        <template #item.max_amount="{ item }">{{ formatGhs((item as any).max_amount) }}</template>
        <template #item.approver="{ item }">
          {{ (item as any).approver ? `${(item as any).approver.first_name} ${(item as any).approver.last_name}` : '—' }}
        </template>
        <template #item.is_active="{ item }">
          <VChip :color="(item as any).is_active ? 'success' : 'default'" size="small" variant="tonal">
            {{ (item as any).is_active ? 'Active' : 'Inactive' }}
          </VChip>
        </template>
        <template #item.actions="{ item }">
          <VBtn icon variant="text" size="small" @click="openRuleDialog(item)">
            <VIcon size="18">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon variant="text" size="small" color="error" @click="confirmDeleteRule((item as any).id)">
            <VIcon size="18">mdi-delete-outline</VIcon>
          </VBtn>
        </template>
        <template #no-data>
          <div class="pa-4 text-medium-emphasis">No rules yet. Without rules, finance approval is final.</div>
        </template>
      </VDataTable>
    </VCard>

    <AppDialog
      v-model="ruleDialog"
      :title="ruleForm.id ? 'Edit Approval Rule' : 'Add Approval Rule'"
      :loading="savingRule"
      @confirm="saveRule"
    >
      <VRow class="mb-1">
        <VCol cols="6">
          <VTextField v-model.number="ruleForm.min_amount" label="From (GHS) *" type="number" min="0" />
        </VCol>
        <VCol cols="6">
          <VTextField v-model.number="ruleForm.max_amount" label="Up to (GHS)" type="number" min="0" placeholder="No limit" clearable />
        </VCol>
      </VRow>
      <VAutocomplete
        v-model="ruleForm.approver_id"
        :items="approverOptions"
        label="Final Approver *"
        class="mb-4"
      />
      <VSwitch v-model="ruleForm.is_active" label="Active" />
    </AppDialog>

    <ConfirmDialog
      v-model="ruleDeleteDialog"
      title="Delete Approval Rule"
      question="Delete this approval rule?"
      confirm-text="Delete"
      :loading="deletingRule"
      @confirm="doDeleteRule"
    >
      <p class="text-body-2 text-medium-emphasis mt-2 mb-0">
        Requests already waiting on this rule's approver will stay assigned to them.
      </p>
    </ConfirmDialog>
</template>
