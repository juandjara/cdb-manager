import { API_VERSIONS } from '@/components/aside/AccountForm'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react'

export const ACCOUNTS_KEY = 'CDB_Manager_Accounts'
const initialState = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
const AccountContext = createContext(initialState)
const AccountDispatchContext = createContext()

export const ACCOUNT_ACTIONS = {
  CREATE: 'account_create',
  UPDATE: 'account_update',
  DELETE: 'account_delete',
  SELECT: 'account_select',
  IMPORT: 'account_import'
}

export const QUERY_HISTORY_ACTIONS = {
  CREATE: 'query_create',
  UPDATE: 'query_update',
  DELETE: 'query_delete'
}

/*
type QueryHistoryEntry = {
  query: string
  name: string
  updated_at: Date
  pinned: boolean
}
*/

function queryHistoryReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case QUERY_HISTORY_ACTIONS.CREATE: {
      const newQuery = payload
      const hasQuery = state.some((e) => e.query === newQuery)

      let newState
      if (hasQuery) {
        newState = state.map((e) =>
          e.query === newQuery ? { ...e, updated_at: Date.now() } : e
        )
      } else {
        newState = state.concat({
          name: `Query ${state.length + 1}`,
          query: payload,
          updated_at: Date.now(),
          pinned: false
        })
      }

      return newState.slice(-100)
    }
    case QUERY_HISTORY_ACTIONS.UPDATE:
      return state.map((opt) =>
        opt.query === payload.query ? { ...opt, ...payload } : opt
      )
    case QUERY_HISTORY_ACTIONS.DELETE:
      return state.filter((opt) => opt.query !== payload)
    default:
      return state
  }
}

function accountsReducer(state, action) {
  const { type, payload } = action
  if (type.substring(0, 6) === 'query_') {
    const account = getSelectedAccount(state)
    if (account) {
      const queries = queryHistoryReducer(account.queries || [], action)
      return state.map((opt) =>
        opt.id === account.id ? { ...opt, queries } : opt
      )
    }
  }

  switch (type) {
    case ACCOUNT_ACTIONS.CREATE:
      return state.concat(payload)
    case ACCOUNT_ACTIONS.UPDATE:
      return state.map((opt) =>
        opt.id === payload.id ? { ...opt, ...payload } : opt
      )
    case ACCOUNT_ACTIONS.DELETE:
      return state.filter((opt) => opt.id !== payload)
    case ACCOUNT_ACTIONS.SELECT:
      return state.map((opt) => {
        const selected = opt.id === payload
        return { ...opt, selected }
      })
    case ACCOUNT_ACTIONS.IMPORT:
      return payload
    default:
      return state
  }
}

export function AccountsProvider({ children }) {
  const [state, dispatch] = useReducer(accountsReducer, initialState)

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(state))
  }, [state])

  return (
    <AccountContext.Provider value={state}>
      <AccountDispatchContext.Provider value={dispatch}>
        {children}
      </AccountDispatchContext.Provider>
    </AccountContext.Provider>
  )
}

export function useAccounts() {
  return useContext(AccountContext)
}

function getSelectedAccount(accounts) {
  const account = accounts.find((a) => a.selected)
  if (account && !account.apiVersion) {
    account.apiVersion = API_VERSIONS.V2
  }
  return account
}

export function useSelectedAccount() {
  const accounts = useAccounts()
  return useMemo(() => getSelectedAccount(accounts), [accounts])
}

export function useAccountsActions() {
  const dispatch = useContext(AccountDispatchContext)
  const actions = {}
  for (const actionKey of Object.values(ACCOUNT_ACTIONS)) {
    actions[actionKey] = (payload) => dispatch({ type: actionKey, payload })
  }

  return actions
}

export function useQueryHistoryActions() {
  const dispatch = useContext(AccountDispatchContext)
  const actions = {}
  for (const actionKey of Object.values(QUERY_HISTORY_ACTIONS)) {
    actions[actionKey] = (payload) => dispatch({ type: actionKey, payload })
  }

  return actions
}
