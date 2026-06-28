import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTicket } from '../api'

export function useDeleteTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) => deleteTicket(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
