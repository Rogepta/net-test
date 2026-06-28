import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTicket } from '../api'

export const useCreateTicket = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      onSuccess()
    },
  })
}
