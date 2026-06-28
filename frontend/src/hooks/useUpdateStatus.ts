import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatus } from '../api'
import type { Status } from '../types'

export const useUpdateStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Status }) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
