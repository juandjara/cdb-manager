import React, { useMemo, useState } from 'react'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'
import useSQL from '@/lib/useSQL'
import DataTable from 'react-data-table-component'

export default function SQLConsole() {
  const [query, setQuery] = useState('')
  const [newQuery, setNewQuery] = useState('')
  const { data, isLoading } = useSQL(query)

  const columns = useMemo(() => {
    if (!data[0]) {
      return []
    }

    const keys = Object.keys(data[0])
    return keys.map((key) => ({
      name: key,
      selector: key,
      style: {
        maxWidth: '200px'
      }
    }))
  }, [data])

  function runQuery() {
    setQuery(newQuery)
  }

  return (
    <div className="p-6 max-w-7xl">
      <div
        style={{ minHeight: '348px', maxHeight: 'calc(100vh - 230px)' }}
        className="overflow-auto border-2 border-gray-300 rounded-lg"
      >
        <CodeEditor
          value={newQuery}
          onChange={setNewQuery}
          style={{ minHeight: 'inherit' }}
        />
      </div>
      <Button className="mt-4" onClick={runQuery} color="blue">
        Run Query
      </Button>
      <div className="mt-8 border-gray-200">
        {query && (
          <DataTable
            keyField="cartodb_id"
            noHeader
            responsive
            pagination
            loading={isLoading}
            columns={columns}
            data={data}
            customStyles={{
              pagination: {
                style: {
                  '& select': {
                    minWidth: '36px'
                  },
                  '& select + svg': {
                    display: 'none'
                  }
                }
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
