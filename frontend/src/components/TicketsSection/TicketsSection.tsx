import type { Priority, SortBy, SortOrder, Status, Ticket } from '../../types'
import FilterBar from '../FilterBar'
import Pagination from '../Pagination'
import TicketTable from '../TicketTable'
import styles from './TicketsSection.module.css'

interface Props {
  tickets: Ticket[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  adminToken: string | null
  search: string
  status: Status | ''
  priority: Priority | ''
  sortBy: SortBy
  order: SortOrder
  page: number
  totalPages: number
  onSearchChange: (value: string) => void
  onStatusChange: (value: Status | '') => void
  onPriorityChange: (value: Priority | '') => void
  onSortByChange: (value: SortBy) => void
  onOrderChange: (value: SortOrder) => void
  onPageChange: (page: number) => void
}

const TicketsSection = ({
  tickets,
  isLoading,
  isError,
  error,
  adminToken,
  search,
  status,
  priority,
  sortBy,
  order,
  page,
  totalPages,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onOrderChange,
  onPageChange,
}: Props) => {
  return (
    <section className={styles.tableCard}>
      <FilterBar
        search={search}
        status={status}
        priority={priority}
        sortBy={sortBy}
        order={order}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onPriorityChange={onPriorityChange}
        onSortByChange={onSortByChange}
        onOrderChange={onOrderChange}
      />
      <TicketTable
        tickets={tickets}
        isLoading={isLoading}
        isError={isError}
        error={error}
        adminToken={adminToken}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  )
}

export default TicketsSection
