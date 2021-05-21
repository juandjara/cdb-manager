import React from 'react'

function getCellClass(col) {
  return `px-5 py-3 text-${col.align || 'left'}`
}

function defaultCellRender(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }
  return JSON.stringify(value)
}

export default function Table({ columns = [], data, isLoading }) {
  return (
    <div className="max-w-full overflow-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${getCellClass(col)} font-semibold`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-gray-300">
              {columns.map((col) => (
                <td key={col.key} className={`${getCellClass(col)} align-top`}>
                  {(col.render || defaultCellRender)(row[col.key], row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
