import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { AccountsProvider } from '@/lib/AccountsContext.jsx'
import { AlertProvider } from '@/lib/AlertContext.jsx'
import Routes from '@/components/Routes'
import { QueryHistoryProvider } from './lib/QueryHistoryContext'

const apiClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  return (
    <QueryHistoryProvider>
      <AccountsProvider>
        <QueryClientProvider client={apiClient}>
          <AlertProvider>
            <Routes />
          </AlertProvider>
        </QueryClientProvider>
      </AccountsProvider>
    </QueryHistoryProvider>
  )
}
