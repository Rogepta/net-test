import { type FormEvent, useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import Toast from '../Toast'
import styles from './AdminLogin.module.css'

interface IAdminLoginProps {
  onLogin: (token: string) => void
}

const AdminLogin = ({ onLogin }: IAdminLoginProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error, reset } = useLogin(onLogin)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutate({ username, password })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        name="username"
        autoComplete="username"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.loginBtn} type="submit" disabled={isPending}>
        Войти
      </button>
      {error && <Toast message={error.message} onClose={reset} />}
    </form>
  )
}

export default AdminLogin
