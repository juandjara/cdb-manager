import React from 'react'

export const buttonFocusStyle =
  'focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent'

const base = `transition-colors rounded-md text-sm font-medium`

export default function Button({
  children,
  className = '',
  padding = 'px-4 py-2',
  backgroundColor = 'hover:bg-blue-200 bg-blue-100',
  textColor = 'text-blue-700',
  color,
  ...props
}) {
  if (color) {
    backgroundColor = `hover:bg-${color}-200 bg-${color}-100`
    textColor = `text-${color}-700`
  }

  const style = `${className} ${buttonFocusStyle} ${padding} ${backgroundColor} ${textColor} ${base}`
  return (
    <button {...props} className={style}>{children}</button>
  )
}
