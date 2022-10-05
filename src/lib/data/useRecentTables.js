import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { decodeToken } from '../authConfig'

export default function useRecentTables({ accessToken, region } = {}) {
  const decodedToken = useMemo(() => decodeToken(accessToken), [accessToken])
  const tokenIsValid = !!decodedToken

  return useQuery(
    ['recentTables', region, accessToken],
    () => {
      const url = `https://workspace-gcp-${region}.app.carto.com/connections/resources/recent?pageSize=5`
      const headers = {
        Authorization: `Bearer ${accessToken}`
      }

      return axios.get(url, { headers }).then((res) => res.data)
    },
    { enabled: tokenIsValid }
  )
}
