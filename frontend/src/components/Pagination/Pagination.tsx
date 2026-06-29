import styles from './Pagination.module.css'

interface IPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: IPaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        Страница {page} из {totalPages}
      </span>
      <div className={styles.controls}>
        <button className={styles.btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ← Назад
        </button>
        <button
          className={styles.btn}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Вперёд →
        </button>
      </div>
    </div>
  )
}

export default Pagination
