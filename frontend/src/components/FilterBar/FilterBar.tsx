import type { Priority, SortBy, SortOrder, Status } from '../../types'
import styles from './FilterBar.module.css'

interface IFilterBarProps {
  search: string
  status: Status | ''
  priority: Priority | ''
  sortBy: SortBy
  order: SortOrder
  onSearchChange: (value: string) => void
  onStatusChange: (value: Status | '') => void
  onPriorityChange: (value: Priority | '') => void
  onSortByChange: (value: SortBy) => void
  onOrderChange: (value: SortOrder) => void
}

const FilterBar = ({
  search,
  status,
  priority,
  sortBy,
  order,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onOrderChange,
}: IFilterBarProps) => {
  return (
    <div className={styles.toolbar}>
      <input
        className={styles.search}
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className={styles.toolSelect}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as Status | '')}
      >
        <option value="">All statuses</option>
        <option value="new">New</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <select
        className={styles.toolSelect}
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as Priority | '')}
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>

      <span className={styles.divider} />

      <select
        className={styles.toolSelect}
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortBy)}
      >
        <option value="created_at">Created</option>
        <option value="priority">Priority</option>
      </select>

      <select
        className={styles.toolSelect}
        value={order}
        onChange={(e) => onOrderChange(e.target.value as SortOrder)}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  )
}

export default FilterBar
