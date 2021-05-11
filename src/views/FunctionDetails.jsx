import React, { useEffect, useState } from 'react'
import Button from '@/components/common/Button'
import CodeEditor from '@/components/common/CodeEditor'
import { useAlertSetter } from '@/lib/AlertContext'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import useSQLMutation from '@/lib/useSQLMutation'
import { useParams } from '@reach/router'

export default function FunctionDetails() {
  const { data } = useSQL(QUERIES.FUNCTIONS)
  const { name } = useParams()
  const SQLMutation = useSQLMutation()
  const sqlFunction = data.find((d) => d.name === name)
  const [code, setCode] = useState(sqlFunction?.definition)
  const setAlert = useAlertSetter()

  useEffect(() => {
    setCode(sqlFunction?.definition)
  }, [sqlFunction?.definition])

  function updateDefinition() {
    SQLMutation.mutateAsync(code).then(() => {
      setAlert({ type: 'success', text: 'Function updated successfully' })
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div
        style={{ maxHeight: 'calc(100vh - 230px)' }}
        className="overflow-auto border-2 border-gray-300 rounded-lg"
      >
        <CodeEditor value={code} onChange={setCode} />
      </div>
      <Button onClick={updateDefinition} color="blue">
        Update function
      </Button>
    </div>
  )
}
