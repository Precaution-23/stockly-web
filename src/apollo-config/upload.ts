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

// Opens a stored file (e.g. "uploads/<uuid>.pdf") in a new tab. Files require login, so the
// download is fetched with the session token and shown from a temporary blob URL.
export async function openUpload(path: string): Promise<void> {
  // Open the tab synchronously (inside the click) so popup blockers allow it
  const tab = window.open('', '_blank')
  try {
    const token = localStorage.getItem('stockly_token')
    const res = await fetch(`${API_BASE}/${path.replace(/^\/+/, '')}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || `Could not open file (${res.status})`)
    }
    const url = URL.createObjectURL(await res.blob())
    if (tab) tab.location.href = url
    else window.location.href = url
    // Give the tab time to load before releasing the blob
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }
  catch (e) {
    tab?.close()
    throw e
  }
}
