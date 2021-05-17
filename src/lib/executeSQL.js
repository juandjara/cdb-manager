import axios from 'axios'

export function cleanQuery(sql) {
  return sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

const REQUEST_GET_MAX_URL_LENGTH = 2048
const PATH = 'api/v2/sql'

export default function executeSQL({ query, credentials, options }) {
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

  let promise = null

  const url = `${baseUrl}/${PATH}?${urlParams}`
  if (url.length < REQUEST_GET_MAX_URL_LENGTH) {
    promise = axios
      .get(url, { cancelToken: cancelToken.token })
      .then((res) => res.data)
  } else {
    const postParams = Object.entries(credentialParams)
      .map((e) => `${e[0]}=${encodeURIComponent(e[1])}`)
      .join('&')
    const postUrl = `${baseUrl}/${PATH}?${postParams}`

    promise = axios
      .post(postUrl, { q: params.q }, { cancelToken: cancelToken.token })
      .then((res) => res.data)
  }

  promise.cancel = () =>
    cancelToken.cancel('Query was cancelled by React Query')

  return promise
}
