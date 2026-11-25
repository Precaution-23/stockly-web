import { API_BASE } from './apiBase'

// Uploads a file to the API and returns its stored reference (e.g. "uploads/<uuid>.pdf")
export async function uploadFile(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)

  const token = localStorage.getItem('stockly_token')
  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Upload failed (${res.status})`)
  return data.path
}
