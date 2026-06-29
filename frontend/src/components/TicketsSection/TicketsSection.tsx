import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useTickets } from '../../hooks/useTickets'
import type { Priority, SortBy, SortOrder, Status, TicketQueryParams } from '../../types'
import FilterBar from '../FilterBar'
import Pagination from '../Pagination'
import TicketTable from '../TicketTable'
import styles from './TicketsSection.module.css'

const DEFAULT_PARAMS: TicketQueryParams = {
  sortBy: 'created_at',
  order: 'desc',
  page: 1,
  pageSize: 10,
}

interface ITicketsSectionProps {
  adminToken: string | null
}

const TicketsSection = ({ adminToken }: ITicketsSectionProps) => {
  const [params, setParams] = useState<TicketQueryParams>(DEFAULT_PARAMS)
  const [searchInput, setSearchInput] = useState('')
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

  return (
    <section className={styles.tableCard}>
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
        isFetching={isFetching}
        isError={isError}
        error={error}
        adminToken={adminToken}
      />
      <Pagination page={params.page} totalPages={totalPages ?? 1} onPageChange={handlePageChange} />
    </section>
  )
}

export default TicketsSection
