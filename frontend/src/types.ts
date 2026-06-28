export type Status = 'new' | 'in_progress' | 'done'
export type Priority = 'low' | 'normal' | 'high'
export type SortBy = 'created_at' | 'priority'
export type SortOrder = 'asc' | 'desc'

export interface Ticket {
  id: number
  title: string
  description: string | null
  status: Status
  priority: Priority
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface TicketQueryParams {
  status?: Status
  priority?: Priority
  search?: string
  sortBy: SortBy
  order: SortOrder
  page: number
  pageSize: number
}
