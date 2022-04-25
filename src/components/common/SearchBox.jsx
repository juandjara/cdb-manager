import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'

export default function SearchBox({
  onChange,
  placeholder = 'Search list',
  ...props
}) {
  return (
    <div className="flex items-center space-x-2 rounded-md mt-2 p-2">
      <SearchIcon className="h-5 w-5" />
      <input
        onChange={(ev) => onChange(ev.target.value)}
        placeholder={placeholder}
        className="py-2 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-b border-gray-300"
        {...props}
      />
    </div>
  )
}
