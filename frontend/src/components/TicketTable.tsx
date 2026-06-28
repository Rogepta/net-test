import type { Ticket } from '../types'

interface Props {
  tickets: Ticket[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

export default function TicketTable({ tickets, isLoading, isError, error }: Props) {
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
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>{ticket.status}</td>
            <td>{ticket.priority}</td>
            <td>{new Date(ticket.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
