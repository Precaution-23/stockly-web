// Password rules shown and checked in the UI. The API enforces the same rules
// (stockly-api src/helpers/passwordPolicy.js) — keep them in sync.
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72

export interface PasswordRule {
  label: string
  test: (password: string, email?: string) => boolean
}

export const passwordRules: PasswordRule[] = [
  { label: `At least ${PASSWORD_MIN} characters`, test: p => p.length >= PASSWORD_MIN },
  { label: 'An uppercase letter (A–Z)', test: p => /[A-Z]/.test(p) },
  { label: 'A lowercase letter (a–z)', test: p => /[a-z]/.test(p) },
  { label: 'A number (0–9)', test: p => /[0-9]/.test(p) },
  { label: 'A special character (e.g. ! @ # $ %)', test: p => /[^A-Za-z0-9]/.test(p) },
]

function containsEmailName(password: string, email?: string) {
  const local = (email ?? '').split('@')[0].toLowerCase()
  return local.length >= 3 && password.toLowerCase().includes(local)
}

// Vuetify rule: blank passes (use requiredValidator when the field is mandatory)
export const strongPasswordValidator = (email?: () => string | undefined) => (value: unknown) => {
  const p = String(value ?? '')
  if (!p) return true
  if (p.length > PASSWORD_MAX) return `No more than ${PASSWORD_MAX} characters`
  const missing = passwordRules.filter(r => !r.test(p)).map(r => r.label.toLowerCase())
  if (missing.length) return `Needs ${missing.join(', ')}`
  if (containsEmailName(p, email?.())) return 'Must not contain your email name'
  return true
}
