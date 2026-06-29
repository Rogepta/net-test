import styles from '../TicketTable.module.css'
import TableHead from './TableHead'

const SKELETON_BARS = [styles.skel0, styles.skel1, styles.skel2, styles.skel3, styles.skel4, styles.skel5, styles.skel6]
const SKELETON_ROWS = 5

const TableSkeleton = () => (
  <div>
    <TableHead />
    {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
      <div key={rowIndex} className={styles.skelRow}>
        {SKELETON_BARS.map((width, cellIndex) => (
          <span key={cellIndex} className={`${styles.skelBar} ${width}`} />
        ))}
      </div>
    ))}
  </div>
)

export default TableSkeleton
