import { defineStore } from 'pinia'

// Best human-readable message from an Apollo/GraphQL error, fetch error or plain string
export function errorMessage(e: unknown, fallback = 'Something went wrong'): string {
  if (!e) return fallback
  if (typeof e === 'string') return e
  const err = e as any
  if (err.graphQLErrors?.length) return err.graphQLErrors[0].message
  if (err.networkError) return "Can't reach the server. Check your connection and try again."
  return err.message || fallback
}

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    visible: false,
    message: '',
    color: 'success',
    timeout: 3000,
    // Bumped on every show so a new toast restarts even if one is already open
    key: 0
  }),
  actions: {
    show(message: string, color = 'success') {
      this.$patch({
        visible: true,
        message,
        color,
        timeout: color === 'error' ? 5000 : 3000,
        key: this.key + 1
      })
    },
    success(message: string) {
      this.show(message, 'success')
    },
    error(e: unknown, fallback?: string) {
      this.show(errorMessage(e, fallback), 'error')
    }
  }
})
