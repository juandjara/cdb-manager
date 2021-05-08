import React, { useEffect } from 'react'

const DEFAULT_DELAY = 5000

function getAlertColor(type) {
  if (type === 'error') {
    return 'red'
  }
  if (type === 'success') {
    return 'green'
  }
  return 'red'
}

export default function Alert({ alert, setAlert, delay = DEFAULT_DELAY }) {
  useEffect(() => {
    let id
    if (alert) {
      id = window.setTimeout(() => setAlert(null), delay)
    }
    return () => window.clearTimeout(id)
  }, [alert, setAlert, delay])

  const alertText = typeof alert === 'object' ? alert?.text : alert
  const alertType = alert?.type || 'error'
  const color = getAlertColor(alertType)

  // taken from here: https://tailwindcomponents.com/component/alert-component-with-tailwind-css
  return (
    alert && (
      <div
        className={`z-30 fixed top-0 left-1/2 transform -translate-x-1/2 w-3/4 xl:w-2/4 max-w-xl mt-6 p-4 rounded-md bg-${color}-100 text-base flex items-center`}>
        {/* <AlertIcon className={`text-${color}-700 w-5 h-5 mr-3`} /> */}
        <span className="sr-only">{alertType}:</span>
        <span className={`text-${color}-700`}>{alertText}</span>
      </div>
    )
  )
}
