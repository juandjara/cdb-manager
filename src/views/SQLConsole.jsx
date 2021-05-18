import React, { useState } from 'react'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'
import useSQLMutation from '@/lib/useSQLMutation'
import Table from '@/components/Table'
import extractErrorMessage from '@/lib/extractErrorMessage'
import { ClockIcon, TableIcon } from '@heroicons/react/outline'

function Panel({ children, color }) {
  return (
    <div
      className={`space-y-3 mb-4 rounded-lg bg-${color}-50 text-${color}-900 text-base py-4 px-5`}
    >
      {children}
    </div>
  )
}

export default function SQLConsole() {
  const [query, setQuery] = useState('')
  const mutation = useSQLMutation({ supressErrorAlert: true })

  const columns =
    mutation.isSuccess &&
    Object.keys(mutation.data.fields).map((field) => {
      const type = mutation.data.fields[field].type
      const column = {
        name: field,
        selector: field
      }

      if (type === 'number') {
        column.right = true
      }
      if (type === 'geometry') {
        column.format = () => `Geometry`
      }

      return column
    })

  return (
    <div className="p-6 max-w-7xl">
      <div
        style={{ minHeight: '348px', maxHeight: 'calc(100vh - 230px)' }}
        className="overflow-auto border-2 border-gray-300 rounded-lg"
      >
        <CodeEditor
          value={query}
          onChange={setQuery}
          style={{ minHeight: 'inherit' }}
        />
      </div>
      <Button
        disabled={mutation.isLoading}
        onClick={() => mutation.mutate(query)}
        className="mt-4"
        color="blue"
      >
        Run Query
      </Button>
      <div className="mt-8">
        {mutation.isLoading && <Panel color="yellow">Loading ...</Panel>}
        {mutation.isError && (
          <Panel color="red">{extractErrorMessage(mutation.error)}</Panel>
        )}
        {mutation.isSuccess && (
          <>
            <Panel color="green">
              <p className="flex items-center space-x-3">
                <TableIcon className="h-6 w-6 text-green-500" />
                <span>Total rows: {mutation.data.total_rows}</span>
              </p>
              <p className="flex items-center space-x-3">
                <ClockIcon className="h-6 w-6 text-green-500" />
                <span>Server time: {mutation.data.time}s</span>
              </p>
            </Panel>
            <Table
              columns={columns}
              data={mutation.data.rows}
              isLoading={mutation.isLoading}
            />
          </>
        )}
      </div>
    </div>
  )
}
