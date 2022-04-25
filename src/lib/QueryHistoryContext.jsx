import React, { createContext, useContext, useEffect, useReducer } from 'react'

export const QUERY_HISTORY_KEY = 'CDB_Manager_Query_History'
const initialState = JSON.parse(localStorage.getItem(QUERY_HISTORY_KEY) || '[]')
const QueryHistoryContext = createContext(initialState)
const QueryHistoryDispatchContext = createContext()

export const QUERY_HISTORY_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
}

/*
type QueryHistoryEntry = {
  query: string
  name: string
  updated_at: Date
  pinned: boolean
}
*/

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case QUERY_HISTORY_ACTIONS.CREATE:
      return state.concat(payload)
    case QUERY_HISTORY_ACTIONS.UPDATE:
      return state.map((opt) =>
        opt.id === payload.id ? { ...opt, ...payload } : opt
      )
    case QUERY_HISTORY_ACTIONS.DELETE:
      return state.filter((opt) => opt.id !== payload)
    default:
      return state
  }
}

export function QueryHistoryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(state))
  }, [state])

  return (
    <QueryHistoryContext.Provider value={state}>
      <QueryHistoryDispatchContext.Provider value={dispatch}>
        {children}
      </QueryHistoryDispatchContext.Provider>
    </QueryHistoryContext.Provider>
  )
}

export function useQueryHistory() {
  return useContext(QueryHistoryContext)
}

export function useQueryHistoryActions() {
  const dispatch = useContext(QueryHistoryDispatchContext)
  const actions = {}
  for (const actionKey of Object.values(QUERY_HISTORY_ACTIONS)) {
    actions[actionKey] = (payload) => dispatch({ type: actionKey, payload })
  }

  return actions
}
