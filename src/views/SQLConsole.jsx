import React, { useState } from 'react'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'
import useSQLMutation from '@/lib/useSQLMutation'
import Table from '@/components/Table'

export default function SQLConsole() {
  const [query, setQuery] = useState('')
  const mutation = useSQLMutation()

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
        {mutation.isSuccess && (
          <Table data={mutation.data} isLoading={mutation.isLoading} />
        )}
      </div>
    </div>
  )
}
