import AdminLogin from '../AdminLogin'
import styles from './Header.module.css'

interface Props {
  adminToken: string | null
  onLogin: (token: string) => void
  onLogout: () => void
}

const Header = ({ adminToken, onLogin, onLogout }: Props) => {
  const account = adminToken ? (
    <div className={styles.userBox}>
      <span className={styles.avatar}>AD</span>
      <span className={styles.userName}>admin</span>
      <button className={styles.logoutBtn} onClick={onLogout}>
        Выйти
      </button>
    </div>
  ) : (
    <AdminLogin onLogin={onLogin} />
  )

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>З</div>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Учёт заявок</span>
        </div>
      </div>
      {account}
    </header>
  )
}

export default Header
