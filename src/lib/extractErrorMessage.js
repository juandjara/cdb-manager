export default function extractErrorMessage(error) {
  if (!error) return '(empty)'

  if (typeof error === 'string') return error

  let msg = error.message
  if (error.response && error.response.data && error.response.data.error) {
    msg = String(error.response.data.error)
  }

  return msg
}
