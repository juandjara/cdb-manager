import React from 'react'

export default function Tag({ children, color = 'blue' }) {
  return (
    <span
      className={`my-1 uppercase inline-block text-xs px-2 tracking-wide leading-5 rounded-md text-${color}-900 bg-${color}-100`}
    >
      {children}
    </span>
  )
}
