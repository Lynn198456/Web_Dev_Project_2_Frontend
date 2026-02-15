const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

function withQuery(path, query = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })
  const queryString = params.toString()
  return queryString ? `${path}?${queryString}` : path
}

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

export function createAppointment(body) {
  return request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listAppointments(query) {
  return request(withQuery('/api/appointments', query))
}

export function updateAppointmentById(appointmentId, body) {
  return request(`/api/appointments/${appointmentId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function listPets(query) {
  return request(withQuery('/api/pets', query))
}

export function createPet(body) {
  return request('/api/pets', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function deletePetById(petId, query) {
  return request(withQuery(`/api/pets/${petId}`, query), {
    method: 'DELETE',
  })
}

export function getUserProfile(userId) {
  return request(`/api/users/${userId}/profile`)
}

export function updateUserProfile(userId, body) {
  return request(`/api/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function listUsers(query) {
  return request(withQuery('/api/users', query))
}

export function createConsultation(body) {
  return request('/api/consultations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
