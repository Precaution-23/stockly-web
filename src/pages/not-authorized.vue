<route lang="json">
{ "meta": { "layout": "blank" } }
</route>

<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh">
    <VCard max-width="420" class="pa-8 text-center" flat>
      <VIcon size="72" color="error" class="mb-4">mdi-lock-outline</VIcon>
      <h2 class="text-h5 font-weight-bold mb-2">Not Authorized</h2>
      <p class="text-medium-emphasis mb-6">You don't have permission to access this page.</p>
      <VBtn color="primary" variant="flat" :to="{ name: 'dashboard' }">Go to Dashboard</VBtn>
    </VCard>
  </div>
</template>
