import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/outline'
import React, { useState } from 'react'
import Button from './common/Button'
import SelectSimple from './common/SelectSimple'

function getCellClass(col) {
  return `px-5 py-3 text-${col.align || 'left'}`
}

function defaultCellRender(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }
  return JSON.stringify(value)
}

const RPP_OPTIONS = [5, 10, 20, 50]

function processPage({ data, page, rpp }) {
  const firstIndex = page * rpp
  const lastIndex = Math.min(data.length - 1, firstIndex + (rpp - 1))
  const lastPage = Math.floor(data.length / rpp)
  const dataPage = data.slice(firstIndex, lastIndex + 1)

  return {
    firstIndex,
    lastIndex,
    lastPage,
    dataPage
  }
}

export default function Table({ columns = [], data, isLoading }) {
  const [page, setPage] = useState(0)
  const [rpp, setRpp] = useState(RPP_OPTIONS[0])
  const { firstIndex, lastIndex, lastPage, dataPage } = processPage({
    data,
    page,
    rpp
  })

  return (
    <div>
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
            {dataPage.map((row, i) => (
              <tr key={i} className="border-t border-gray-300">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${getCellClass(col)} align-top`}
                  >
                    {(col.render || defaultCellRender)(row[col.key], row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-end">
        <div className="space-x-4 flex items-center mr-8">
          <p className="text-sm text-gray-600">Rows per page: </p>
          <SelectSimple
            className="w-20"
            selected={rpp}
            onChange={setRpp}
            options={RPP_OPTIONS}
          />
          <p className="text-sm text-gray-600">
            {firstIndex + 1} - {lastIndex + 1} of {data.length}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => setPage(0)}
            disabled={firstIndex === 0}
            padding="p-3"
            textColor="text-gray-600"
            backgroundColor="hover:bg-gray-100"
            className="rounded-full"
          >
            <ChevronDoubleLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setPage(page - 1)}
            disabled={firstIndex === 0}
            padding="p-3"
            textColor="text-gray-600"
            backgroundColor="hover:bg-gray-100"
            className="rounded-full"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={lastIndex === data.length - 1}
            padding="p-3"
            textColor="text-gray-600"
            backgroundColor="hover:bg-gray-100"
            className="rounded-full"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setPage(lastPage)}
            disabled={lastIndex === data.length - 1}
            padding="p-3"
            textColor="text-gray-600"
            backgroundColor="hover:bg-gray-100"
            className="rounded-full"
          >
            <ChevronDoubleRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
