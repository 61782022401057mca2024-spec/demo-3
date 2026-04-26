const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const AUTH_TOKEN_KEY = 'erp_auth_token'
const AUTH_USER_KEY = 'erp_auth_user'

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function saveAuth(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorData = await response.json()
      message = errorData.detail || errorData.message || message
    } catch {
      // Keep the fallback message when the error body is not JSON.
    }

    throw new Error(message)
  }

  return response.json()
}

export function createCustomer(payload) {
  return request('/customer/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createSupplier(payload) {
  return request('/supplier/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createItem(payload) {
  return request('/inventory/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getItems() {
  return request('/inventory/')
}

export function getCustomers() {
  return request('/customer/')
}

export function getSuppliers() {
  return request('/supplier/')
}

export function getPurchaseInwards() {
  return request('/purchase-inward/')
}

export function createPurchaseInward(payload) {
  return request('/purchase-inward/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getDashboardSummary() {
  return request('/dashboard/summary')
}

export function getSalesDCs() {
  return request('/sales-dc/')
}

export function createSalesDC(payload) {
  return request('/sales-dc/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getTaxInvoices() {
  return request('/tax-invoice/')
}

export function createTaxInvoice(payload) {
  return request('/tax-invoice/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSaleInvoices() {
  return request('/sale-invoice/')
}

export function createSaleInvoice(payload) {
  return request('/sale-invoice/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginUser(payload) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  saveAuth(result.token, result.user)
  return result
}

export function getCurrentUser() {
  return request('/auth/me')
}
