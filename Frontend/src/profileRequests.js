// Each lookup owns its responses; cleanup also ignores fetch implementations that
// finish after abort (for example, a response already being decoded).
const API_BASE = import.meta.env?.VITE_API_URL || 'https://sportsga.onrender.com'

export function startProfileRequests(name, callbacks, fetchImpl = fetch) {
  const controller = new AbortController()
  let active = true
  const timer = setTimeout(() => controller.abort(), 20000)
  const query = new URLSearchParams({ name })
  const request = async (path, success, failure) => {
    try {
      const response = await fetchImpl(`${API_BASE}${path}?${query}`, {
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('Player data could not be loaded.')
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      if (active) success(data)
    } catch (error) {
      if (active) failure(error)
    }
  }
  Promise.all([
    request('/player', callbacks.profile, callbacks.error),
    request('/player/career', callbacks.career, callbacks.careerError),
  ]).finally(() => clearTimeout(timer))
  return () => {
    active = false
    controller.abort()
    clearTimeout(timer)
  }
}
