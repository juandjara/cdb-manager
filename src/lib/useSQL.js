import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import { useAlertSetter } from './AlertContext'
import executeSQL from './executeSQL'
import extractErrorMessage from './extractErrorMessage'

export default function useSQL(query) {
  const credentials = useSelectedAccount()
  const setAlert = useAlertSetter()

  const result = useQuery(
    [query, credentials],
    () => executeSQL({ query, credentials }),
    { enabled: !!query && !!credentials }
  )

  useEffect(() => {
    if (result.error) {
      // eslint-disable-next-line no-console
      console.error(result.error)
      setAlert(extractErrorMessage(result.error))
    }
  }, [result.error, setAlert])

  return {
    ...result,
    time: result.data && result.data.time,
    data: (result.data && result.data.rows) || []
  }
}
