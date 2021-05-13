import React, { useState } from 'react'
import useSQLMutation from '@/lib/useSQLMutation'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'

export default function SQLConsole() {
  const [code, setCode] = useState('')
  const SQLMutation = useSQLMutation()

  function updateDefinition() {
    SQLMutation.mutateAsync(code).then((rows) => {
      console.log(rows)
    })
  }

  return (
    <div className="p-6 space-y-4">
      <div
        style={{ minHeight: '300px', maxHeight: 'calc(100vh - 230px)' }}
        className="overflow-auto border-2 border-gray-300 rounded-lg"
      >
        <CodeEditor style={{ minHeight: 'inherit' }} value={code} onChange={setCode} />
      </div>
      <Button onClick={updateDefinition} color="blue">
        Run Query
      </Button>
    </div>
  )
}
