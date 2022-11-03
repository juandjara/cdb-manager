import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { decodeToken } from '../authConfig'

export default function useConnectionResource(
  { accessToken, region } = {},
  connection = '',
  resource = ''
) {
  const decodedToken = useMemo(() => decodeToken(accessToken), [accessToken])
  const tokenIsValid = !!decodedToken

  return useQuery(
    ['connectionResource', region, accessToken, connection, resource],
    () => {
      const url = `https://workspace-gcp-${region}.app.carto.com/connections/${connection}/resources/${resource}`
      const headers = {
        Authorization: `Bearer ${accessToken}`
      }

      return axios.get(url, { headers }).then((res) => res.data)
    },
    { enabled: tokenIsValid }
  )
}
