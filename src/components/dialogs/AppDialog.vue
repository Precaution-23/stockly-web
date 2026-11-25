<script setup lang="ts">
// Standard dialog shell (modelled on uvosyo's modal):
// title bar with close button · divider · content · divider · Cancel ←→ Confirm footer.
interface Props {
  modelValue: boolean
  title: string
  subtitle?: string
  width?: number | string
  confirmText?: string
  confirmColor?: string
  cancelText?: string
  loading?: boolean
  canSubmit?: boolean
  hideFooter?: boolean
  hideConfirm?: boolean
  persistent?: boolean
  scrollable?: boolean
  // Remove the default padding around the content slot (e.g. for tables)
  flush?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: undefined,
  width: 500,
  confirmText: 'Save',
  confirmColor: 'primary',
  cancelText: 'Cancel',
  loading: false,
  canSubmit: true,
  hideFooter: false,
  hideConfirm: false,
  persistent: true,
  scrollable: false,
  flush: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function close() {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<template>
  <VDialog
    :model-value="modelValue"
    :width="width"
    :persistent="persistent"
    :scrollable="scrollable"
    @update:model-value="(v: boolean) => (v ? emit('update:modelValue', true) : close())"
  >
    <VCard class="app-dialog">
      <VCardTitle class="app-dialog__header d-flex align-center justify-space-between py-3 px-5">
        <div class="app-dialog__title-wrap">
          <div class="text-h5 app-dialog__title">{{ title }}</div>
          <div v-if="subtitle" class="text-body-2 text-medium-emphasis">{{ subtitle }}</div>
        </div>
        <div class="d-flex align-center ml-2">
          <slot name="header-actions" />
          <VTooltip :text="loading ? 'Please wait...' : 'Close'">
            <template #activator="{ props: tip }">
              <VBtn
                v-bind="tip"
                icon
                size="small"
                color="error"
                variant="plain"
                :disabled="loading"
                @click="close"
              >
                <VIcon icon="mdi-close" />
              </VBtn>
            </template>
          </VTooltip>
        </div>
      </VCardTitle>

      <VDivider />

      <VCardText :class="flush ? 'pa-0' : 'pa-5'">
        <slot />
      </VCardText>

      <template v-if="!hideFooter">
        <VDivider />
        <VCardActions class="py-3 px-5">
          <slot name="actions" :close="close">
            <VBtn color="secondary" variant="tonal" :disabled="loading" @click="close">
              {{ cancelText }}
            </VBtn>
            <VSpacer />
            <slot name="footer-extra" />
            <VBtn
              v-if="!hideConfirm"
              :color="confirmColor"
              :variant="canSubmit ? 'flat' : 'tonal'"
              :loading="loading"
              :disabled="!canSubmit"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </VBtn>
          </slot>
        </VCardActions>
      </template>
    </VCard>
  </VDialog>
</template>

<style scoped>
.app-dialog__title-wrap {
  flex: 1;
  min-width: 0;
}

.app-dialog__title {
  line-height: 1.3 !important;
  white-space: normal;
  word-break: break-word;
}
</style>
