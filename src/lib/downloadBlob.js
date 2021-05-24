export default function downloadBlob(text, mime, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const anchor = document.createElement('a')
  anchor.href = url
  if (filename) {
    anchor.setAttribute('download', filename)
  }
  anchor.className = 'download-js-link'
  anchor.innerHTML = 'downloading...'
  anchor.style.display = 'none'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)

  // why this timeout ??
  setTimeout(() => {
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => {
      URL.revokeObjectURL(anchor.href)
    }, 250)
  }, 50)
}
