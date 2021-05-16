import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import { useAlertSetter } from './AlertContext'
import executeSQL from './executeSQL'

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
      let msg = result.error.message
      if (result.error.response.data && result.error.response.data.error) {
        msg = String(result.error.response.data.error)
      }
      setAlert(msg)
    }
  }, [result.error, setAlert])

  return {
    ...result,
    data: result.data || []
  }
}
