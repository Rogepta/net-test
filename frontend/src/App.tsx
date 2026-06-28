import { useEffect, useState } from 'react'
import FilterBar from './components/FilterBar'
import Pagination from './components/Pagination'
import TicketTable from './components/TicketTable'
import { useDebounce } from './hooks/useDebounce'
import { useTickets } from './hooks/useTickets'
import type { Priority, SortBy, SortOrder, Status, TicketQueryParams } from './types'

const DEFAULT_PARAMS: TicketQueryParams = {
  sortBy: 'created_at',
  order: 'desc',
  page: 1,
  pageSize: 10,
}

export default function App() {
  const [params, setParams] = useState<TicketQueryParams>(DEFAULT_PARAMS)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setParams((prev) => ({ ...prev, search: debouncedSearch || undefined, page: 1 }))
  }, [debouncedSearch])

  const { data, isLoading, isError, error } = useTickets(params)

  function handleStatusChange(status: Status | '') {
    setParams((prev) => ({ ...prev, status: status || undefined, page: 1 }))
  }

  function handlePriorityChange(priority: Priority | '') {
    setParams((prev) => ({ ...prev, priority: priority || undefined, page: 1 }))
  }

  function handleSortByChange(sortBy: SortBy) {
    setParams((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  function handleOrderChange(order: SortOrder) {
    setParams((prev) => ({ ...prev, order, page: 1 }))
  }

  function handlePageChange(page: number) {
    setParams((prev) => ({ ...prev, page }))
  }

  return (
    <div>
      <FilterBar
        search={searchInput}
        status={params.status ?? ''}
        priority={params.priority ?? ''}
        sortBy={params.sortBy}
        order={params.order}
        onSearchChange={setSearchInput}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onSortByChange={handleSortByChange}
        onOrderChange={handleOrderChange}
      />
      <TicketTable
        tickets={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error instanceof Error ? error : null}
      />
      <Pagination
        page={params.page}
        totalPages={data?.total_pages ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
