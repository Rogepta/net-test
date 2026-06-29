import { useState } from 'react'
import styles from './App.module.css'
import CreateTicketForm from './components/CreateTicketForm'
import Header from './components/Header'
import TicketsSection from './components/TicketsSection'

const App = () => {
  const [adminToken, setAdminToken] = useState<string | null>(null)

  const handleLogout = () => {
    setAdminToken(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.stack}>
        <Header adminToken={adminToken} onLogin={setAdminToken} onLogout={handleLogout} />

        <CreateTicketForm />

        <TicketsSection adminToken={adminToken} />
      </div>
    </div>
  )
}

export default App
