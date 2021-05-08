import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from './lib/AccountsContext.jsx'
import { QueryClientProvider, QueryClient } from 'react-query'

const apiClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={apiClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
