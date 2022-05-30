import axios from 'axios'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import { useAlertSetter } from './AlertContext'
import executeSQL from './executeSQL'
import extractErrorMessage from './extractErrorMessage'
import {
  QUERY_HISTORY_ACTIONS,
  useQueryHistoryActions
} from './AccountsContext'

export default function useSQLMutation(config = {}) {
  const { token: cancelToken } = axios.CancelToken.source()
  const credentials = useSelectedAccount()
  const setAlert = useAlertSetter()
  const actions = useQueryHistoryActions()

  const mutation = useMutation(async (query) => {
    const result = await executeSQL({ credentials, cancelToken, query })
    actions[QUERY_HISTORY_ACTIONS.CREATE](query)
    return result
  }, config)

  useEffect(() => {
    if (mutation.isError && !config.supressErrorAlert) {
      // eslint-disable-next-line no-console
      console.error(mutation.error)
      setAlert(extractErrorMessage(mutation.error))
    }
  }, [config.supressErrorAlert, mutation.isError, mutation.error, setAlert])

  return mutation
}
