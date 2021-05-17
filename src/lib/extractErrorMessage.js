export default function extractErrorMessage(error) {
  let msg = error.message
  if (error.response.data && error.response.data.error) {
    msg = String(error.response.data.error)
  }

  return msg
}
