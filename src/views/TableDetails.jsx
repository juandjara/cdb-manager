import Table from '@/components/Table'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import { useParams } from '@reach/router'
import React from 'react'

export default function TableDetails() {
  const { tableid, tablename } = useParams()
  const { data, isLoading } = useSQL(QUERIES.TABLE(tableid))

  return (
    <div className="p-6 max-w-7xl">
      <h2 className="text-2xl font-medium mb-4">{tablename}</h2>
      <Table data={data} isLoading={isLoading} />
    </div>
  )
}
