const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (_networkError) {
    throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Start backend server and try again.`)
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.')
  }

  return payload
}

export function registerUser(body) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function loginUser(body) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
