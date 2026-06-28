import { useState } from 'react'
import { useCreateTicket } from '../../hooks/useCreateTicket'
import type { Priority } from '../../types'
import styles from './CreateTicketForm.module.css'

const CreateTicketForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [clientError, setClientError] = useState<string | null>(null)

  const { mutate, isPending, error } = useCreateTicket(() => {
    setTitle('')
    setDescription('')
    setPriority('normal')
    setClientError(null)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (trimmed.length < 3 || trimmed.length > 120) {
      setClientError('Title must be between 3 and 120 characters')
      return
    }
    setClientError(null)
    mutate({ title: trimmed, description: description.trim() || undefined, priority })
  }

  return (
    <form className={styles.section} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Новая заявка</h2>
      <div className={styles.stack}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ticket-title">
            Заголовок <span className={styles.req}>*</span>
          </label>
          <input
            id="ticket-title"
            className={`${styles.input} ${clientError ? styles.inputError : ''}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
          {clientError && (
            <span className={styles.errorRow}>
              <span className={styles.errIcon}>!</span>
              {clientError}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="ticket-description">
            Описание
          </label>
          <textarea
            id="ticket-description"
            className={styles.textarea}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
        </div>

        {error && (
          <span className={styles.errorRow}>
            <span className={styles.errIcon}>!</span>
            {error.message}
          </span>
        )}

        <div className={styles.bottomRow}>
          <select
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={isPending}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          <button className={styles.submitBtn} type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Создать заявку'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default CreateTicketForm
