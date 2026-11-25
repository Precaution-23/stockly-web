<script setup lang="ts">
import AppSnackbar from '@/components/AppSnackbar.vue'
</script>

<template>
  <RouterView />
  <!-- Global toasts (overlays teleport to <body>, so this works on every layout) -->
  <AppSnackbar />
</template>
