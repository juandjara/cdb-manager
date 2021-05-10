import React from 'react'

function noop() {}

function applyAccesor(item, accesor) {
  return typeof accesor === 'function' ? accesor(item) : item[accesor]
}

export default function List({
  items = [],
  getTitle = noop,
  getSubtitle = noop,
  getSecondary = noop
}) {
  return (
    <ul className="max-h-96 overflow-auto text-gray-700 space-y-2 py-2 border-2 border-blue-100 shadow-sm rounded-lg mt-2">
      {items.map((d, i) => (
        <li
          key={d.id || i}
          className="hover:bg-blue-50 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <div>
            <p className="text-base">{applyAccesor(d, getTitle)}</p>
            <p className="text-gray-500">{applyAccesor(d, getSubtitle)}</p>
          </div>
          <p className="text-sm mx-1">{applyAccesor(d, getSecondary)}</p>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-sm text-gray-700 px-2">No data</li>
      )}
    </ul>
  )
}
