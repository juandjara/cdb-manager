import { API_VERSIONS } from '@/components/aside/AccountForm'
import axios from 'axios'

export function cleanQuery(sql) {
  return sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

const REQUEST_GET_MAX_URL_LENGTH = 2048
const SQL_V2_PATH = 'api/v2/sql'

export default function executeSQL({ query, credentials, options }) {
  if (credentials.apiVersion === API_VERSIONS.V3) {
    return executeSQLV3({ query, credentials, options })
  }

  const username = credentials.username || 'public'
  const apikey = credentials.apikey || 'default_public'
  const urlTemplate = credentials.urlTemplate || 'https://{user}.carto.com'
  const cancelToken = axios.CancelToken.source()

  const credentialParams = { username, api_key: apikey }

  const params = {
    ...credentialParams,
    q: cleanQuery(query),
    ...options
  }

  const urlParams = Object.entries(params)
    .map((e) => `${e[0]}=${encodeURIComponent(e[1])}`)
    .join('&')

  let baseUrl = urlTemplate.replace('{user}', username)

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1)
  }

  const url = `${baseUrl}/${SQL_V2_PATH}?${urlParams}`

  let promise = null
  if (url.length < REQUEST_GET_MAX_URL_LENGTH) {
    promise = axios
      .get(url, { cancelToken: cancelToken.token })
      .then((res) => res.data)
  } else {
    const postParams = Object.entries(credentialParams)
      .map((e) => `${e[0]}=${encodeURIComponent(e[1])}`)
      .join('&')
    const postUrl = `${baseUrl}/${SQL_V2_PATH}?${postParams}`

    promise = axios
      .post(postUrl, { q: params.q }, { cancelToken: cancelToken.token })
      .then((res) => res.data)
  }

  promise.cancel = () =>
    cancelToken.cancel('Query was cancelled by React Query')

  return promise
}

function executeSQLV3({ query, credentials, options }) {
  const connection = credentials.connection || 'carto_dw'
  const region = credentials.region || 'us-east1'
  const accessToken = credentials.accessToken
  const cancelToken = axios.CancelToken.source()

  if (!accessToken) {
    throw new Error(
      `[executeSQL.js] accessToken must be defined. Received ${accessToken}`
    )
  }

  const baseUrl = `https://gcp-${region}.api.carto.com/v3/sql/${connection}/query`
  const GETUrl = `${baseUrl}?q=${encodeURIComponent(cleanQuery(query))}`
  const headers = {
    Authorization: `Bearer ${accessToken}`
  }

  let promise = null
  if (GETUrl.length < REQUEST_GET_MAX_URL_LENGTH) {
    promise = axios
      .get(baseUrl, {
        headers,
        cancelToken: cancelToken.token,
        params: { q: cleanQuery(query), ...options }
      })
      .then((res) => res.data)
  } else {
    promise = axios
      .post(baseUrl, { q: query }, { headers, cancelToken: cancelToken.token })
      .then((res) => res.data)
  }

  promise.cancel = () =>
    cancelToken.cancel('Query was cancelled by React Query')

  return promise
}
