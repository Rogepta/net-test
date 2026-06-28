import { type FormEvent, useState } from 'react'
import { login } from '../api'

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
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <span> {error}</span>}
    </form>
  )
}

export default AdminLogin
