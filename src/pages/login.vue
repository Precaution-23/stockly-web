<route lang="json">
{ "meta": { "layout": "blank", "public": true, "redirectIfLoggedIn": true } }
</route>

<script setup lang="ts">
import { requiredValidator, emailValidator } from '@/@core/utils/validators'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const form = ref()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return
  await authStore.login(email.value, password.value)
}
</script>

<template>
  <VApp>
    <VMain class="d-flex align-center justify-center" style="background: #F5F5F5; min-height: 100vh;">
      <VCard class="pa-8" width="440" elevation="2">
        <div class="text-center mb-6">
          <VIcon size="48" color="primary" icon="mdi-package-variant-closed" />
          <h1 class="text-h4 font-weight-bold mt-2">Stockly</h1>
          <p class="text-body-2 text-medium-emphasis">Church Inventory Management</p>
        </div>

        <VAlert v-if="authStore.error" type="error" class="mb-4" closable @click:close="authStore.error = ''">
          {{ authStore.error }}
        </VAlert>

        <VForm ref="form" @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-1 d-block">Email</label>
            <AppTextField
              v-model="email"
              placeholder="admin@stockly.church"
              type="email"
              :rules="[requiredValidator, emailValidator]"
              prepend-inner-icon="mdi-email-outline"
            />
          </div>

          <div class="mb-2">
            <label class="text-body-2 font-weight-medium mb-1 d-block">Password</label>
            <AppTextField
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :rules="[requiredValidator]"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            />
          </div>

          <div class="text-right mb-6">
            <RouterLink to="/forgot-password" class="text-body-2 text-primary text-decoration-none">
              Forgot password?
            </RouterLink>
          </div>

          <VBtn
            type="submit"
            block
            size="large"
            :loading="authStore.loading"
          >
            Sign In
          </VBtn>
        </VForm>

        <div class="text-center mt-4">
          <span class="text-body-2 text-medium-emphasis">Don't have an account? </span>
          <RouterLink to="/signup" class="text-body-2 text-primary text-decoration-none font-weight-medium">
            Sign up
          </RouterLink>
        </div>
      </VCard>
    </VMain>
  </VApp>
</template>
