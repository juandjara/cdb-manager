import axios from 'axios'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import { useAlertSetter } from './AlertContext'
import executeSQL from './executeSQL'

export default function useSQL(query) {
  const { token: cancelToken } = axios.CancelToken.source()
  const credentials = useSelectedAccount()
  const setAlert = useAlertSetter()

  const result = useQuery(
    [query, credentials],
    () => executeSQL({ credentials, cancelToken, query }),
    { enabled: !!credentials }
  )

  useEffect(() => {
    if (result.error) {
      // eslint-disable-next-line no-console
      console.error(result.error)
      setAlert(result.error.message)
    }
  }, [result.error, setAlert])

  return result
}
