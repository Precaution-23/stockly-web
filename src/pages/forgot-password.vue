<route lang="json">
{ "meta": { "layout": "blank", "public": true, "redirectIfLoggedIn": true } }
</route>

<script setup lang="ts">
import { requiredValidator, emailValidator } from '@/@core/utils/validators'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const form = ref()
const email = ref('')

const handleSubmit = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return
  await authStore.requestPasswordReset(email.value)
}
</script>

<template>
  <VApp>
    <VMain class="d-flex align-center justify-center" style="background: #F5F5F5; min-height: 100vh;">
      <VCard class="pa-8" width="440" elevation="2">
        <div class="text-center mb-6">
          <VIcon size="48" color="primary" icon="mdi-lock-reset" />
          <h1 class="text-h5 font-weight-bold mt-2">Forgot Password</h1>
          <p class="text-body-2 text-medium-emphasis">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <VAlert v-if="authStore.error" type="error" class="mb-4" closable @click:close="authStore.error = ''">
          {{ authStore.error }}
        </VAlert>

        <VAlert v-if="authStore.resetMessage" type="success" class="mb-4">
          {{ authStore.resetMessage }}
        </VAlert>

        <VForm v-if="!authStore.resetMessage" ref="form" @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label class="text-body-2 font-weight-medium mb-1 d-block">Email</label>
            <AppTextField
              v-model="email"
              placeholder="you@example.com"
              type="email"
              :rules="[requiredValidator, emailValidator]"
              prepend-inner-icon="mdi-email-outline"
            />
          </div>

          <VBtn
            type="submit"
            block
            size="large"
            :loading="authStore.loading"
          >
            Send Reset Link
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
