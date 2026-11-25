<script setup lang="ts">
import apolloClient from '@/apollo-config'
import { useSnackbarStore } from '@/store/snackbar'

// Refetches every query currently mounted on the page (tables, dropdowns, stats, notifications)
const snackbar = useSnackbarStore()
const refreshing = ref(false)

async function refresh() {
  refreshing.value = true
  try {
    await apolloClient.refetchQueries({ include: 'active' })
    snackbar.success('Data refreshed')
  } catch (e) {
    snackbar.error(e, "Couldn't refresh data")
  } finally {
    refreshing.value = false
  }
}
</script>

<template>
  <VTooltip text="Refresh" location="bottom">
    <template #activator="{ props: tipProps }">
      <VBtn
        v-bind="tipProps"
        icon="mdi-refresh"
        variant="tonal"
        :loading="refreshing"
        :disabled="refreshing"
        @click="refresh"
      />
    </template>
  </VTooltip>
</template>
