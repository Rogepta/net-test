import { useState } from 'react'
import TicketTable from './components/TicketTable'
import { useTickets } from './hooks/useTickets'
import type { TicketQueryParams } from './types'

const DEFAULT_PARAMS: TicketQueryParams = {
  sortBy: 'created_at',
  order: 'desc',
  page: 1,
  pageSize: 10,
}

export default function App() {
  const [params, _setParams] = useState<TicketQueryParams>(DEFAULT_PARAMS)
  const { data, isLoading, isError, error } = useTickets(params)

  return (
    <div>
      <TicketTable
        tickets={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error instanceof Error ? error : null}
      />
    </div>
  )
}
