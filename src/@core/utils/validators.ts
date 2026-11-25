export const requiredValidator = (value: unknown) => {
  if (value === null || value === undefined || value === '') return 'This field is required'
  if (Array.isArray(value) && value.length === 0) return 'This field is required'
  return !!String(value).trim().length || 'This field is required'
}

export const emailValidator = (value: unknown) => {
  if (!value) return true
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(value)) || 'Must be a valid email'
}

export const minLengthValidator = (length: number) => (value: unknown) => {
  return !value || String(value).length >= length || `Minimum ${length} characters`
}
