<script setup lang="ts">
import { passwordRules } from '@/@core/utils/passwordPolicy'

// Live checklist of password rules, ticked off as the user types
const props = defineProps<{ password: string }>()

const checks = computed(() =>
  passwordRules.map(rule => ({ label: rule.label, met: rule.test(props.password ?? '') })),
)
</script>

<template>
  <ul class="password-requirements">
    <li
      v-for="check in checks"
      :key="check.label"
      :class="check.met ? 'text-success' : 'text-medium-emphasis'"
    >
      <VIcon size="16" :icon="check.met ? 'mdi-check-circle' : 'mdi-circle-outline'" class="me-1" />
      {{ check.label }}
    </li>
  </ul>
</template>

<style scoped>
.password-requirements {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  display: grid;
  gap: 2px;
  font-size: 0.8125rem;
}

.password-requirements li {
  display: flex;
  align-items: center;
}
</style>
