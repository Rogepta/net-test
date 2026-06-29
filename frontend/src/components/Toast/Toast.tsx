import { useEffect } from 'react'
import styles from './Toast.module.css'

interface IToastProps {
  message: string
  onClose: () => void
  duration?: number
}

const Toast = ({ message, onClose, duration = 4000 }: IToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  return (
    <div className={styles.toast} role="alert">
      {message}
    </div>
  )
}

export default Toast
