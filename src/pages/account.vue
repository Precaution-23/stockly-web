<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { requiredValidator } from '@/@core/utils/validators'
import { strongPasswordValidator } from '@/@core/utils/passwordPolicy'
import PasswordRequirements from '@/components/PasswordRequirements.vue'
import { useSnackbarStore } from '@/store/snackbar'

const CHANGE_PASSWORD = gql`
  mutation changePassword($payload: ChangePasswordInput!) {
    changePassword(payload: $payload) { message }
  }
`

const userData = computed(() => {
  const s = localStorage.getItem('stockly_userData')
  return s ? JSON.parse(s) : null
})

const snackbar = useSnackbarStore()
const { mutate, loading } = useMutation(CHANGE_PASSWORD)

const form = ref()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const show = ref(false)

const passwordRule = strongPasswordValidator(() => userData.value?.email ?? '')
const matches = (v: string) => v === newPassword.value || 'Passwords do not match'
const differs = (v: string) => !v || v !== currentPassword.value || 'Choose a password different from the current one'

const canSubmit = computed(() =>
  !!currentPassword.value
  && passwordRule(newPassword.value) === true
  && confirmPassword.value === newPassword.value
  && newPassword.value !== currentPassword.value,
)

const submit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return
  try {
    await mutate({ payload: { current_password: currentPassword.value, new_password: newPassword.value } })
    snackbar.success('Password changed')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    form.value.resetValidation()
  }
  catch (e: any) {
    snackbar.error(e)
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">My Account</h2>
      <div class="text-body-2 text-medium-emphasis">Your details and password</div>
    </div>

    <VRow>
      <VCol cols="12" md="5">
        <VCard>
          <VCardTitle class="pa-4 pb-2">Profile</VCardTitle>
          <VDivider />
          <VList density="compact" class="py-2">
            <VListItem title="Name" :subtitle="userData ? `${userData.first_name} ${userData.last_name}` : '—'" />
            <VListItem title="Email" :subtitle="userData?.email ?? '—'" />
            <VListItem title="Group" :subtitle="userData?.group_name ?? '—'" class="text-capitalize" />
            <VListItem title="Role" :subtitle="userData?.role?.name ?? '—'" />
          </VList>
          <VCardText class="pt-0 text-caption text-medium-emphasis">
            To change your name, email or role, ask an administrator.
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="7">
        <VCard>
          <VCardTitle class="pa-4 pb-2">Change Password</VCardTitle>
          <VDivider />
          <VCardText class="pa-4">
            <VForm ref="form" @submit.prevent="submit">
              <VTextField
                v-model="currentPassword"
                label="Current password"
                :type="show ? 'text' : 'password'"
                autocomplete="current-password"
                :rules="[requiredValidator]"
                class="mb-4"
              />
              <VTextField
                v-model="newPassword"
                label="New password"
                :type="show ? 'text' : 'password'"
                autocomplete="new-password"
                :rules="[requiredValidator, passwordRule, differs]"
                class="mb-1"
              />
              <PasswordRequirements :password="newPassword" class="mb-4" />
              <VTextField
                v-model="confirmPassword"
                label="Confirm new password"
                :type="show ? 'text' : 'password'"
                autocomplete="new-password"
                :rules="[requiredValidator, matches]"
                class="mb-2"
              />
              <VCheckbox v-model="show" label="Show passwords" density="compact" hide-details class="mb-4" />
              <VBtn type="submit" :loading="loading" :disabled="!canSubmit">Change password</VBtn>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
