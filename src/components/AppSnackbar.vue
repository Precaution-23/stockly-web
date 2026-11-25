<script setup lang="ts">
import { useSnackbarStore } from '@/store/snackbar'

// Global toast host for useSnackbarStore(); mounted once in App.vue
const snackbar = useSnackbarStore()
</script>

<template>
  <VSnackbar
    :key="snackbar.key"
    v-model="snackbar.visible"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top right"
  >
    <div class="d-flex align-center ga-2">
      <VIcon size="20">{{ snackbar.color === 'error' ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline' }}</VIcon>
      <span>{{ snackbar.message }}</span>
    </div>
    <template #actions>
      <VBtn icon variant="text" size="small" @click="snackbar.visible = false">
        <VIcon size="18">mdi-close</VIcon>
      </VBtn>
    </template>
  </VSnackbar>
</template>
