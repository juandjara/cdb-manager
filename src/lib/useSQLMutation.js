import axios from 'axios'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import { useAlertSetter } from './AlertContext'
import executeSQL from './executeSQL'
import extractErrorMessage from './extractErrorMessage'

export default function useSQLMutation(config = {}) {
  const { token: cancelToken } = axios.CancelToken.source()
  const credentials = useSelectedAccount()
  const setAlert = useAlertSetter()

  const mutation = useMutation(
    (query) => executeSQL({ credentials, cancelToken, query }),
    config
  )

  useEffect(() => {
    if (mutation.isError && !config.supressErrorAlert) {
      // eslint-disable-next-line no-console
      console.error(mutation.error)
      setAlert(extractErrorMessage(mutation.error))
    }
  }, [config.supressErrorAlert, mutation.isError, mutation.error, setAlert])

  return mutation
}
