<script setup lang="ts">
import AppDialog from './AppDialog.vue'

// Confirmation prompt (modelled on uvosyo's ConfirmDialog): centred "!" badge and question.
interface Props {
  modelValue: boolean
  question: string
  title?: string
  confirmText?: string
  confirmColor?: string
  iconColor?: string
  loading?: boolean
  canSubmit?: boolean
  width?: number | string
}

withDefaults(defineProps<Props>(), {
  title: 'Please confirm',
  confirmText: 'Confirm',
  confirmColor: 'error',
  iconColor: undefined,
  loading: false,
  canSubmit: true,
  width: 450,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :confirm-text="confirmText"
    :confirm-color="confirmColor"
    :loading="loading"
    :can-submit="canSubmit"
    @update:model-value="(v: boolean) => emit('update:modelValue', v)"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
  >
    <div class="text-center px-4">
      <VBtn
        icon
        variant="outlined"
        :color="iconColor || confirmColor"
        style="pointer-events: none"
        tabindex="-1"
      >
        <span class="text-h5" style="color: inherit !important">!</span>
      </VBtn>
      <h6 class="text-h6 mt-4">{{ question }}</h6>
      <slot />
    </div>
  </AppDialog>
</template>
