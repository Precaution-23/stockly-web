<route lang="json">
{ "meta": { "layout": "blank", "public": true } }
</route>

<script setup lang="ts">
import { requiredValidator } from '@/@core/utils/validators'
import { strongPasswordValidator } from '@/@core/utils/passwordPolicy'
import PasswordRequirements from '@/components/PasswordRequirements.vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const route = useRoute()
const form = ref()
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const token = computed(() => route.query.token as string)
// Links from the welcome email (new accounts) carry ?welcome=1
const isWelcome = computed(() => route.query.welcome === '1')

const confirmPasswordValidator = (value: string) => {
  return value === newPassword.value || 'Passwords do not match'
}

const handleReset = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return
  if (!token.value) {
    authStore.error = 'Invalid or missing reset token.'
    return
  }
  await authStore.resetPassword(token.value, newPassword.value)
}
</script>

<template>
  <VApp>
    <VMain class="d-flex align-center justify-center" style="background: #F5F5F5; min-height: 100vh;">
      <VCard class="pa-8" width="440" elevation="2">
        <div class="text-center mb-6">
          <VIcon size="48" color="primary" :icon="isWelcome ? 'mdi-account-key-outline' : 'mdi-lock-reset'" />
          <h1 class="text-h5 font-weight-bold mt-2">{{ isWelcome ? 'Welcome to Stockly' : 'Reset Password' }}</h1>
          <p class="text-body-2 text-medium-emphasis">
            {{ isWelcome ? 'Choose a password for your new account.' : 'Enter your new password below.' }}
          </p>
        </div>

        <VAlert v-if="!token" type="warning" class="mb-4">
          Invalid or missing reset token. Please request a new reset link.
          <div class="mt-2">
            <RouterLink to="/forgot-password" class="text-decoration-none">Request new link</RouterLink>
          </div>
        </VAlert>

        <VAlert v-if="authStore.error" type="error" class="mb-4" closable @click:close="authStore.error = ''">
          {{ authStore.error }}
        </VAlert>

        <VForm v-if="token" ref="form" @submit.prevent="handleReset">
          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-1 d-block">New Password</label>
            <AppTextField
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :rules="[requiredValidator, strongPasswordValidator()]"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            />
            <PasswordRequirements :password="newPassword" />
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-medium mb-1 d-block">Confirm Password</label>
            <AppTextField
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="••••••••"
              :rules="[requiredValidator, confirmPasswordValidator]"
              prepend-inner-icon="mdi-lock-check-outline"
              :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirm = !showConfirm"
            />
          </div>

          <VBtn
            type="submit"
            block
            size="large"
            :loading="authStore.loading"
          >
            {{ isWelcome ? 'Set Password' : 'Reset Password' }}
          </VBtn>
        </VForm>

        <div class="text-center mt-4">
          <RouterLink to="/login" class="text-body-2 text-primary text-decoration-none">
            ← Back to Sign In
          </RouterLink>
        </div>
      </VCard>
    </VMain>
  </VApp>
</template>
