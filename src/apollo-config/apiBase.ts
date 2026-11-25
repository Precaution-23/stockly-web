// API origin. Defaults to the host the app was loaded from, so it works both on this
// machine (localhost) and from other devices on the network (e.g. 192.168.x.x).
export const API_BASE: string =
  import.meta.env.VITE_API_BASE || `${window.location.protocol}//${window.location.hostname}:4000`
