import Select from '@/components/common/Select'
import Table from '@/components/Table'
import { DETAIL_QUERIES } from '@/lib/tableDetailsQueries'
import useSQL from '@/lib/useSQL'
import { useParams } from '@reach/router'
import React, { useState } from 'react'

function makeColumns(data) {
  if (!data[0]) {
    return []
  }

  const keys = Object.keys(data[0])
  return keys.map((key) => ({
    title: key,
    key
  }))
}

function titleCase(str) {
  return str[0].toUpperCase() + str.substr(1).toLowerCase()
}

const QUERY_OPTIONS = Object.entries(DETAIL_QUERIES).map((entry) => ({
  label: titleCase(entry[0]),
  value: entry[0],
  fn: entry[1]
}))

export default function TableDetails() {
  const { tableid, tablename } = useParams()
  const [query, setQuery] = useState(QUERY_OPTIONS[0])
  const { data, isLoading } = useSQL(query.fn(tableid))
  const columns = makeColumns(data)

  return (
    <div className="p-6 max-w-7xl">
      <header className="flex justify-between items-center space-x-4 mb-4">
        <h2 className="text-2xl font-medium space-x-2">
          <span>{tablename}</span>
          <small className="text-lg text-gray-500">({query.label})</small>
        </h2>
        <Select
          className="w-40"
          options={QUERY_OPTIONS}
          selected={query}
          onChange={setQuery}
        />
      </header>
      <Table columns={columns} data={data} isLoading={isLoading} />
    </div>
  )
}
