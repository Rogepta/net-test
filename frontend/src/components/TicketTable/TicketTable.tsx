import { useCallback } from 'react'
import { useDeleteTicket } from '../../hooks/useDeleteTicket'
import { useUpdateStatus } from '../../hooks/useUpdateStatus'
import type { Status, Ticket } from '../../types'
import Toast from '../Toast'
import TableHead from './parts/TableHead'
import TableSkeleton from './parts/TableSkeleton'
import { EmptyState, ErrorState } from './parts/TableState'
import TicketRow from './parts/TicketRow'
import styles from './TicketTable.module.css'

interface ITicketTableProps {
  tickets: Ticket[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  adminToken: string | null
}

const TicketTable = ({ tickets, isLoading, isFetching, isError, error, adminToken }: ITicketTableProps) => {
  const updateStatus = useUpdateStatus()
  const deleteTicket = useDeleteTicket()
  const mutationError = updateStatus.error ?? deleteTicket.error

  const resetMutations = useCallback(() => {
    updateStatus.reset()
    deleteTicket.reset()
  }, [updateStatus.reset, deleteTicket.reset])

  const handleStatusChange = (id: number, status: Status) => {
    updateStatus.mutate({ id, status })
  }

  const handleDelete = (id: number) => {
    if (adminToken) {
      deleteTicket.mutate({ id, token: adminToken })
    }
  }

  if (isLoading) return <TableSkeleton />

  if (isError) {
    return <ErrorState message={error?.message ?? 'Проверьте подключение к серверу и попробуйте снова.'} />
  }

  if (tickets.length === 0) return <EmptyState />

  return (
    <div className={isFetching ? styles.fetching : undefined} aria-busy={isFetching}>
      {mutationError && <Toast message={mutationError.message} onClose={resetMutations} />}
      <TableHead />
      {tickets.map((ticket) => (
        <TicketRow
          key={ticket.id}
          ticket={ticket}
          adminToken={adminToken}
          isUpdating={updateStatus.isPending && updateStatus.variables?.id === ticket.id}
          isDeleting={deleteTicket.isPending && deleteTicket.variables?.id === ticket.id}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default TicketTable
