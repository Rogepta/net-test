import { type FormEvent, useEffect, useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import styles from './AdminLogin.module.css'

interface Props {
  onLogin: (token: string) => void
}

const AdminLogin = ({ onLogin }: Props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error, reset } = useLogin(onLogin)

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(reset, 4000)
    return () => clearTimeout(timer)
  }, [error, reset])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutate({ username, password })
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
      <button className={styles.loginBtn} type="submit" disabled={isPending}>
        Войти
      </button>
      {error && (
        <div className={styles.toast} role="alert">
          {error.message}
        </div>
      )}
    </form>
  )
}

export default AdminLogin
