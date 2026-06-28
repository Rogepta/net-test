import type { PaginatedResponse, Priority, Status, Ticket, TicketQueryParams } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = (await res.json()) as { detail?: string | { msg?: string }[] }
      if (typeof body.detail === 'string') {
        detail = body.detail
      } else if (Array.isArray(body.detail)) {
        const message = body.detail.map((item) => item.msg).filter(Boolean).join(', ')
        if (message) detail = message
      }
    } catch {
      detail = res.statusText
    }
    throw new Error(detail)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const fetchTickets = async (params: TicketQueryParams): Promise<PaginatedResponse<Ticket>> => {
  const query = new URLSearchParams()
  query.set('page', String(params.page))
  query.set('page_size', String(params.pageSize))
  query.set('sort_by', params.sortBy)
  query.set('order', params.order)
  if (params.status) query.set('status', params.status)
  if (params.priority) query.set('priority', params.priority)
  if (params.search) query.set('search', params.search)
  return request(`/tickets?${query}`)
}

export const createTicket = async (payload: {
  title: string
  description?: string
  priority: Priority
}): Promise<Ticket> => {
  return request('/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export const updateStatus = async (id: number, status: Status): Promise<Ticket> => {
  return request(`/tickets/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export const deleteTicket = async (id: number, token: string): Promise<void> => {
  return request(`/tickets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const login = async (username: string, password: string): Promise<{ access_token: string; token_type: string }> => {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}
