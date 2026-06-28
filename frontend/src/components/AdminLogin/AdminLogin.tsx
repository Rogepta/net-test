import { type FormEvent, useState } from 'react'
import { login } from '../../api'
import styles from './AdminLogin.module.css'

interface Props {
  onLogin: (token: string) => void
}

const AdminLogin = ({ onLogin }: Props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(username, password)
      onLogin(data.access_token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.loginBtn} type="submit" disabled={loading}>
        Войти
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  )
}

export default AdminLogin
