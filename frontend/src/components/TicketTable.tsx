import { useDeleteTicket } from '../hooks/useDeleteTicket'
import { useUpdateStatus } from '../hooks/useUpdateStatus'
import type { Status, Ticket } from '../types'

const STATUSES: Status[] = ['new', 'in_progress', 'done']

interface RowProps {
  ticket: Ticket
  adminToken: string | null
}

function TicketRow({ ticket, adminToken }: RowProps) {
  const updateStatus = useUpdateStatus()
  const deleteTicket = useDeleteTicket()

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateStatus.mutate({ id: ticket.id, status: e.target.value as Status })
  }

  function handleDelete() {
    if (adminToken) {
      deleteTicket.mutate({ id: ticket.id, token: adminToken })
    }
  }

  return (
    <tr>
      <td>{ticket.id}</td>
      <td>{ticket.title}</td>
      <td>
        <select
          value={ticket.status}
          disabled={ticket.status === 'done'}
          onChange={handleStatusChange}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {updateStatus.error && <span> {(updateStatus.error as Error).message}</span>}
      </td>
      <td>{ticket.priority}</td>
      <td>{new Date(ticket.created_at).toLocaleString()}</td>
      {adminToken && (
        <td>
          <button onClick={handleDelete} disabled={deleteTicket.isPending}>
            Delete
          </button>
          {deleteTicket.error && <span> {(deleteTicket.error as Error).message}</span>}
        </td>
      )}
    </tr>
  )
}

interface Props {
  tickets: Ticket[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  adminToken: string | null
}

export default function TicketTable({ tickets, isLoading, isError, error, adminToken }: Props) {
  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error?.message ?? 'Unknown error'}</p>
  }

  if (tickets.length === 0) {
    return <p>No tickets found.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Created</th>
          {adminToken && <th>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} adminToken={adminToken} />
        ))}
      </tbody>
    </table>
  )
}
