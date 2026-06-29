import { useEffect, useState } from 'react'
import styles from './App.module.css'
import CreateTicketForm from './components/CreateTicketForm'
import Header from './components/Header'
import TicketsSection from './components/TicketsSection'
import { useDebounce } from './hooks/useDebounce'
import { useTickets } from './hooks/useTickets'
import type { Priority, SortBy, SortOrder, Status, TicketQueryParams } from './types'

const DEFAULT_PARAMS: TicketQueryParams = {
  sortBy: 'created_at',
  order: 'desc',
  page: 1,
  pageSize: 10,
}

const App = () => {
  const [params, setParams] = useState<TicketQueryParams>(DEFAULT_PARAMS)
  const [searchInput, setSearchInput] = useState('')
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setParams(prev => ({ ...prev, search: debouncedSearch || undefined, page: 1 }))
  }, [debouncedSearch])

  const { data, isLoading, isFetching, isError, error } = useTickets(params)

  const totalPages = data?.total_pages

  useEffect(() => {
    if (totalPages && params.page > totalPages) {
      setParams(prev => ({ ...prev, page: totalPages }))
    }
  }, [totalPages, params.page])

  const handleStatusChange = (status: Status | '') => {
    setParams(prev => ({ ...prev, status: status || undefined, page: 1 }))
  }

  const handlePriorityChange = (priority: Priority | '') => {
    setParams(prev => ({ ...prev, priority: priority || undefined, page: 1 }))
  }

  const handleSortByChange = (sortBy: SortBy) => {
    setParams(prev => ({ ...prev, sortBy, page: 1 }))
  }

  const handleOrderChange = (order: SortOrder) => {
    setParams(prev => ({ ...prev, order, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }))
  }

  const handleLogout = () => {
    setAdminToken(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.stack}>
        <Header adminToken={adminToken} onLogin={setAdminToken} onLogout={handleLogout} />

        <CreateTicketForm />

        <TicketsSection
          tickets={data?.items ?? []}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          error={error}
          adminToken={adminToken}
          search={searchInput}
          status={params.status ?? ''}
          priority={params.priority ?? ''}
          sortBy={params.sortBy}
          order={params.order}
          page={params.page}
          totalPages={totalPages ?? 1}
          onSearchChange={setSearchInput}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onSortByChange={handleSortByChange}
          onOrderChange={handleOrderChange}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default App
