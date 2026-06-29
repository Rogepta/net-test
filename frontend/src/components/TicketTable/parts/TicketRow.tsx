import type { Priority, Status, Ticket } from '../../../types'
import styles from '../TicketTable.module.css'

const STATUSES: Status[] = ['new', 'in_progress', 'done']

const STATUS_CLASS: Record<Status, string> = {
  new: styles.statusNew,
  in_progress: styles.statusProgress,
  done: styles.statusDone,
}

const PRIORITY_CLASS: Record<Priority, string> = {
  low: styles.priorityLow,
  normal: styles.priorityNormal,
  high: styles.priorityHigh,
}

interface ITicketRowProps {
  ticket: Ticket
  adminToken: string | null
  isUpdating: boolean
  isDeleting: boolean
  onStatusChange: (id: number, status: Status) => void
  onDelete: (id: number) => void
}

const TicketRow = ({ ticket, adminToken, isUpdating, isDeleting, onStatusChange, onDelete }: ITicketRowProps) => {
  const isDone = ticket.status === 'done'
  const canDelete = Boolean(adminToken)

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(ticket.id, e.target.value as Status)
  }

  const handleDelete = () => {
    onDelete(ticket.id)
  }

  return (
    <div className={`${styles.row} ${isDone ? styles.rowDone : ''}`}>
      <span className={styles.id}>#{ticket.id}</span>
      <span className={`${styles.title} ${isDone ? styles.titleDone : ''}`}>{ticket.title}</span>
      <span className={styles.desc}>{ticket.description}</span>
      <select
        className={`${styles.statusSelect} ${STATUS_CLASS[ticket.status]}`}
        value={ticket.status}
        disabled={isDone || isUpdating}
        title={isDone ? 'Готовые заявки не редактируются' : undefined}
        onChange={handleStatusChange}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <span className={styles.priorityCol}>
        <span className={`${styles.priority} ${PRIORITY_CLASS[ticket.priority]}`}>{ticket.priority}</span>
      </span>
      <span className={styles.created}>{new Date(ticket.created_at).toLocaleString()}</span>
      <span className={styles.action}>
        <button
          className={`${styles.trash} ${canDelete ? styles.trashActive : ''}`}
          disabled={!canDelete || isDeleting}
          title={canDelete ? undefined : 'Доступно только администратору'}
          onClick={handleDelete}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2.5 3.5h9M5.5 3.5V2.5h3v1M3.5 3.5l.5 8h6l.5-8M6 6v3M8 6v3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </span>
    </div>
  )
}

export default TicketRow
