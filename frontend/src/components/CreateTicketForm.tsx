import { useState } from 'react'
import { useCreateTicket } from '../hooks/useCreateTicket'
import type { Priority } from '../types'

export default function CreateTicketForm() {
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

  function handleSubmit(e: React.FormEvent) {
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
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          disabled={isPending}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>
      {clientError && <p>{clientError}</p>}
      {error && <p>{error.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Create ticket'}
      </button>
    </form>
  )
}
