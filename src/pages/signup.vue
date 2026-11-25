<route lang="json">
{ "meta": { "layout": "blank", "public": true, "redirectIfLoggedIn": true } }
</route>

<script setup lang="ts">
import { requiredValidator, emailValidator, minLengthValidator } from '@/@core/utils/validators'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const form = ref()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const confirmPasswordValidator = (value: string) => {
  return value === password.value || 'Passwords do not match'
}

const handleSignup = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return
  await authStore.signup({
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    password: password.value
  })
}
</script>

<template>
  <VApp>
    <VMain class="d-flex align-center justify-center" style="background: #F5F5F5; min-height: 100vh;">
      <VCard class="pa-8" width="480" elevation="2">
        <div class="text-center mb-6">
          <VIcon size="48" color="primary" icon="mdi-package-variant-closed" />
          <h1 class="text-h4 font-weight-bold mt-2">Stockly</h1>
          <p class="text-body-2 text-medium-emphasis">Create your account</p>
        </div>

        <VAlert v-if="authStore.error" type="error" class="mb-4" closable @click:close="authStore.error = ''">
          {{ authStore.error }}
        </VAlert>

        <VForm ref="form" @submit.prevent="handleSignup">
          <VRow>
            <VCol cols="6">
              <label class="text-body-2 font-weight-medium mb-1 d-block">First Name</label>
              <AppTextField
                v-model="firstName"
                placeholder="John"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi-account-outline"
              />
            </VCol>
            <VCol cols="6">
              <label class="text-body-2 font-weight-medium mb-1 d-block">Last Name</label>
              <AppTextField
                v-model="lastName"
                placeholder="Doe"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>

          <div class="mb-4 mt-2">
            <label class="text-body-2 font-weight-medium mb-1 d-block">Email</label>
            <AppTextField
              v-model="email"
              placeholder="you@example.com"
              type="email"
              :rules="[requiredValidator, emailValidator]"
              prepend-inner-icon="mdi-email-outline"
            />
          </div>

          <div class="mb-4">
            <label class="text-body-2 font-weight-medium mb-1 d-block">Password</label>
            <AppTextField
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :rules="[requiredValidator, minLengthValidator(8)]"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            />
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
            Create Account
          </VBtn>
        </VForm>

        <div class="text-center mt-4">
          <span class="text-body-2 text-medium-emphasis">Already have an account? </span>
          <RouterLink to="/login" class="text-body-2 text-primary text-decoration-none font-weight-medium">
            Sign in
          </RouterLink>
        </div>
      </VCard>
    </VMain>
  </VApp>
</template>
