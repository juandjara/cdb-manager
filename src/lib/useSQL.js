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
      setAlert(JSON.stringify(result.error))
    }
  }, [result.error, setAlert])

  return result
}
