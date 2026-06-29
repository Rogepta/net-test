import { useDeleteTicket } from '../../hooks/useDeleteTicket'
import { useUpdateStatus } from '../../hooks/useUpdateStatus'
import type { Priority, Status, Ticket } from '../../types'
import styles from './TicketTable.module.css'

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

const SKELETON_BARS = [styles.skel0, styles.skel1, styles.skel2, styles.skel3, styles.skel4, styles.skel5, styles.skel6]

const TableHead = () => (
  <div className={styles.head}>
    <span>ID</span>
    <span>Заголовок</span>
    <span>Описание</span>
    <span>Статус</span>
    <span className={styles.priorityCol}>Приоритет</span>
    <span>Создана</span>
    <span />
  </div>
)

interface RowProps {
  ticket: Ticket
  adminToken: string | null
  isUpdating: boolean
  isDeleting: boolean
  onStatusChange: (id: number, status: Status) => void
  onDelete: (id: number) => void
}

const TicketRow = ({ ticket, adminToken, isUpdating, isDeleting, onStatusChange, onDelete }: RowProps) => {
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

interface Props {
  tickets: Ticket[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  adminToken: string | null
}

const TicketTable = ({ tickets, isLoading, isError, error, adminToken }: Props) => {
  const updateStatus = useUpdateStatus()
  const deleteTicket = useDeleteTicket()
  const mutationError = updateStatus.error ?? deleteTicket.error

  const handleStatusChange = (id: number, status: Status) => {
    updateStatus.mutate({ id, status })
  }

  const handleDelete = (id: number) => {
    if (adminToken) {
      deleteTicket.mutate({ id, token: adminToken })
    }
  }

  if (isLoading) {
    return (
      <div>
        <TableHead />
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.skelRow}>
            {SKELETON_BARS.map((width, cellIndex) => (
              <span key={cellIndex} className={`${styles.skelBar} ${width}`} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`${styles.state} ${styles.stateError}`}>
        <span className={`${styles.stateIcon} ${styles.stateIconError}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 2.5l8 14H2l8-14zM10 8v3.5M10 14h.01"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.stateTitle}>Не удалось загрузить заявки</span>
        <span className={styles.stateSub}>{error?.message ?? 'Проверьте подключение к серверу и попробуйте снова.'}</span>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className={`${styles.state} ${styles.stateEmpty}`}>
        <span className={`${styles.stateIcon} ${styles.stateIconEmpty}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 6h10M5 10h10M5 14h6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className={styles.stateTitle}>Заявок пока нет</span>
        <span className={styles.stateSub}>Создайте первую заявку или измените параметры фильтра.</span>
      </div>
    )
  }

  return (
    <div>
      {mutationError && (
        <div className={styles.mutationError} role="alert">
          {mutationError.message}
        </div>
      )}
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
