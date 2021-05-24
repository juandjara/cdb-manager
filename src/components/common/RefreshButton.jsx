import { RefreshIcon } from '@heroicons/react/outline'
import React from 'react'

function noop() {}

export default function RefreshButton({
  className = '',
  loading,
  onClick = noop,
  ...props
}) {
  const loadingStyle = loading
    ? 'animate-spin'
    : 'opacity-0 group-hover:opacity-100'
  const iconStyle = `${loadingStyle} h-5 w-5 text-blue-500 hover:text-blue-700`

  function handleClick(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    onClick(ev)
  }

  return (
    <div
      role="button"
      title="Refresh list"
      className={`${className} p-2 rounded-md`}
      onClick={handleClick}
      {...props}
    >
      <RefreshIcon className={iconStyle} />
    </div>
  )
}
