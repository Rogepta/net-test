import type { ReactNode } from 'react'
import styles from '../TicketTable.module.css'

const VARIANT_CLASS = {
  error: { container: styles.stateError, icon: styles.stateIconError },
  empty: { container: styles.stateEmpty, icon: styles.stateIconEmpty },
} as const

interface ITableStateProps {
  variant: keyof typeof VARIANT_CLASS
  icon: ReactNode
  title: string
  subtitle: string
}

const TableState = ({ variant, icon, title, subtitle }: ITableStateProps) => (
  <div className={`${styles.state} ${VARIANT_CLASS[variant].container}`}>
    <span className={`${styles.stateIcon} ${VARIANT_CLASS[variant].icon}`}>{icon}</span>
    <span className={styles.stateTitle}>{title}</span>
    <span className={styles.stateSub}>{subtitle}</span>
  </div>
)

const errorIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5l8 14H2l8-14zM10 8v3.5M10 14h.01"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const emptyIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 6h10M5 10h10M5 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export const ErrorState = ({ message }: { message: string }) => (
  <TableState variant="error" icon={errorIcon} title="Не удалось загрузить заявки" subtitle={message} />
)

export const EmptyState = () => (
  <TableState
    variant="empty"
    icon={emptyIcon}
    title="Заявок пока нет"
    subtitle="Создайте первую заявку или измените параметры фильтра."
  />
)
