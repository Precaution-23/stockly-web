import { defineStore } from 'pinia'
import { provideApolloClient, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ability from '@/plugins/casl/ability'
import type { UserAbility, Subjects } from '@/plugins/casl/AppAbility'
import apolloClient from '@/apollo-config'
import router from '@/plugins/1.router'
import { useSnackbarStore } from '@/store/snackbar'

provideApolloClient(apolloClient)

const LOGIN_MUTATION = gql`
  mutation login($payload: LoginMutationInput!) {
    login(payload: $payload) {
      token
      user {
        id first_name last_name email group_name is_active
        role { id name description }
        permissions { id resource create read update delete }
      }
    }
  }
`

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation requestPasswordReset($payload: RequestPasswordResetInput!) {
    requestPasswordReset(payload: $payload) {
      message
    }
  }
`

const LOGOUT_MUTATION = gql`
  mutation logout {
    logout {
      message
    }
  }
`

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($payload: ResetPasswordInput!) {
    resetPassword(payload: $payload) {
      message
    }
  }
`

function applyUserSession(res: { token: string; user: any }) {
  localStorage.setItem('stockly_token', res.token)
  localStorage.setItem('stockly_userData', JSON.stringify(res.user))

  const userAbilities: UserAbility[] = []
  res.user.permissions?.forEach((p: any) => {
    if (p?.create) userAbilities.push({ action: 'create', subject: p.resource as Subjects })
    if (p?.read) userAbilities.push({ action: 'read', subject: p.resource as Subjects })
    if (p?.update) userAbilities.push({ action: 'update', subject: p.resource as Subjects })
    if (p?.delete) userAbilities.push({ action: 'delete', subject: p.resource as Subjects })
  })

  const hasAdminView = res.user.permissions?.some(
    (p: any) => p?.read && ['Roles', 'Users'].includes(p.resource)
  )
  if (hasAdminView) userAbilities.push({ action: 'read', subject: 'AdminView' })

  ability.update(userAbilities)
  localStorage.setItem('stockly_abilities', JSON.stringify(userAbilities))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: '',
    resetMessage: ''
  }),

  actions: {
    async login(email: string, password: string) {
      this.$patch({ loading: true, error: '' })

      const { mutate, onDone, onError } = useMutation(LOGIN_MUTATION)

      onDone((result) => {
        const res = result.data?.login
        if (!res) return
        applyUserSession(res)
        this.$patch({ loading: false })
        router.push('/dashboard')
      })

      onError((err) => {
        this.$patch({ loading: false, error: err.message || 'Login failed' })
      })

      await mutate({ payload: { email, password } })
    },

    async requestPasswordReset(email: string) {
      this.$patch({ loading: true, error: '', resetMessage: '' })

      const { mutate, onDone, onError } = useMutation(REQUEST_PASSWORD_RESET_MUTATION)

      onDone((result) => {
        const msg = result.data?.requestPasswordReset?.message || 'Check your email for a reset link.'
        this.$patch({ loading: false, resetMessage: msg })
      })

      onError((err) => {
        this.$patch({ loading: false, error: err.message || 'Request failed' })
      })

      await mutate({ payload: { email } })
    },

    async resetPassword(token: string, newPassword: string) {
      this.$patch({ loading: true, error: '' })

      const { mutate, onDone, onError } = useMutation(RESET_PASSWORD_MUTATION)

      onDone(() => {
        this.$patch({ loading: false })
        useSnackbarStore().success('Password updated — please log in')
        router.push('/login')
      })

      onError((err) => {
        this.$patch({ loading: false, error: err.message || 'Reset failed' })
      })

      await mutate({ payload: { token, new_password: newPassword } })
    },

    logout() {
      const { mutate } = useMutation(LOGOUT_MUTATION)
      mutate().finally(() => {
        localStorage.removeItem('stockly_token')
        localStorage.removeItem('stockly_userData')
        localStorage.removeItem('stockly_abilities')
        ability.update([{ action: 'read', subject: 'Auth' }])
        router.push('/login')
        useSnackbarStore().success("You've been logged out")
      }).catch(() => {
        // Server-side token invalidation failed; the local session is cleared regardless
      })
    }
  }
})
