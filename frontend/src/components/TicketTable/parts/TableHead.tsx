import styles from '../TicketTable.module.css'

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

export default TableHead
