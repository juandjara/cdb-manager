import axios from 'axios'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import { useAlertSetter } from './AlertContext'
import executeSQL from './executeSQL'

export default function useSQLMutation(config = {}) {
  const { token: cancelToken } = axios.CancelToken.source()
  const credentials = useSelectedAccount()
  const setAlert = useAlertSetter()

  const mutation = useMutation(
    (query) => executeSQL({ credentials, cancelToken, query }),
    config
  )

  useEffect(() => {
    if (mutation.isError) {
      // eslint-disable-next-line no-console
      console.error(mutation.error)
      let msg = mutation.error.message
      if (mutation.error.response.data && mutation.error.response.data.error) {
        msg = String(mutation.error.response.data.error)
      }
      setAlert(msg)
    }
  }, [mutation.isError, mutation.error, setAlert])

  return mutation
}
