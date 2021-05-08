import React, { createContext, useContext, useEffect, useReducer } from 'react'

export const ACCOUNTS_KEY = 'CDB_Manager_Accounts'
const initialState = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
const AccountContext = createContext(initialState)
const DispatchContext = createContext()

export const ACCOUNT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  SELECT: 'select'
}

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case ACCOUNT_ACTIONS.CREATE:
      return state.concat(payload)
    case ACCOUNT_ACTIONS.UPDATE:
      return state.map((opt) =>
        opt.apikey === payload.apikey ? { ...opt, ...payload } : opt
      )
    case ACCOUNT_ACTIONS.DELETE:
      return state.filter((opt) => opt.apikey !== payload)
    case ACCOUNT_ACTIONS.SELECT:
      return state.map((opt) => {
        const selected = opt.apikey === payload
        return { ...opt, selected }
      })
    default:
      return state
  }
}

export function ConfigProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(state))
  }, [state])

  return (
    <AccountContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </AccountContext.Provider>
  )
}

export function useAccounts() {
  return useContext(AccountContext)
}

export function useSelectedAccount() {
  const accounts = useAccounts()
  return accounts.find((a) => a.selected)
}

export function useAccountsActions() {
  const dispatch = useContext(DispatchContext)
  const actions = {}
  for (const actionKey of Object.values(ACCOUNT_ACTIONS)) {
    actions[actionKey] = (payload) => dispatch({ type: actionKey, payload })
  }

  return actions
}