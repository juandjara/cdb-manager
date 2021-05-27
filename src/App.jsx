import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { AccountsProvider } from '@/lib/AccountsContext.jsx'
import { AlertProvider } from '@/lib/AlertContext.jsx'
import Layout from '@/components/Layout'

const apiClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  return (
    <AccountsProvider>
      <QueryClientProvider client={apiClient}>
        <AlertProvider>
          <Layout />
        </AlertProvider>
      </QueryClientProvider>
    </AccountsProvider>
  )
}
