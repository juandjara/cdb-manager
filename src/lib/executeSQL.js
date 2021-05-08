import axios from 'axios'

export function cleanQuery(sql) {
  return sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

const REQUEST_GET_MAX_URL_LENGTH = 2048
const PATH = 'api/v2/sql'

export default function executeSQL({
  credentials,
  query,
  cancelToken,
  options
}) {
  const username = credentials.username || 'public'
  const apikey = credentials.apikey || 'default_public'
  const urlTemplate = credentials.urlTemplate || 'https://{user}.carto.com'

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

  const url = `${baseUrl}/${PATH}?${urlParams}`
  if (url.length < REQUEST_GET_MAX_URL_LENGTH) {
    return axios.get(url, { cancelToken }).then((res) => res.data.rows)
  } else {
    const postParams = Object.entries(credentialParams)
      .map((e) => `${e[0]}=${encodeURIComponent(e[1])}`)
      .join('&')
    const postUrl = `${baseUrl}/${PATH}?${postParams}`

    return axios
      .post(postUrl, { q: params.q }, { cancelToken })
      .then((res) => res.data.rows)
  }
}
