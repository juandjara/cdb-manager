import Alert from '@/components/Alert'
import React, { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

export function useAlertSetter() {
  return useContext(AlertContext)
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null)

  return (
    <AlertContext.Provider value={setAlert}>
      <div className="relative">
        <Alert alert={alert} setAlert={setAlert} />
        {children}
      </div>
    </AlertContext.Provider>
  )
}
