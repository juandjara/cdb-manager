import axios from 'axios'
import { useQuery } from 'react-query'
import { useSelectedAccount } from './AccountsContext'
import executeSQL from './executeSQL'

export default function useSQL(query) {
  const { token: cancelToken } = axios.CancelToken.source()
  const credentials = useSelectedAccount()

  return useQuery(
    [query, credentials],
    () => executeSQL({ credentials, cancelToken, query }),
    { enabled: !!credentials }
  )
}
