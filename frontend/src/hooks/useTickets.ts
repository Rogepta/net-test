import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchTickets } from '../api'
import type { TicketQueryParams } from '../types'

export const useTickets = (params: TicketQueryParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tickets', params],
    queryFn: () => fetchTickets(params),
    placeholderData: keepPreviousData,
  })

  return { data, isLoading, isError, error }
}
