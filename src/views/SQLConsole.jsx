import React, { useState } from 'react'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'
import useSQLMutation from '@/lib/useSQLMutation'
import Table from '@/components/Table'
import extractErrorMessage from '@/lib/extractErrorMessage'

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Total rows: {mutation.data.total_rows}</span>
              </p>
              <p className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Server time: {mutation.data.time}s</span>
              </p>
            </Panel>
            <Table data={mutation.data.rows} isLoading={mutation.isLoading} />
          </>
        )}
      </div>
    </div>
  )
}
