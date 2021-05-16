import React from 'react'
import { ConfigProvider } from './lib/AccountsContext.jsx'
import { QueryClientProvider, QueryClient } from 'react-query'
import Layout from '@/components/Layout'
import { AlertProvider } from './lib/AlertContext.jsx'

const apiClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  return (
    <ConfigProvider>
      <QueryClientProvider client={apiClient}>
        <AlertProvider>
          <Layout />
        </AlertProvider>
      </QueryClientProvider>
    </ConfigProvider>
  )
}
