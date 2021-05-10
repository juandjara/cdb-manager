import CodeEditor from '@/components/common/CodeEditor'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import { useParams } from '@reach/router'
import React from 'react'

export default function FunctionDetails() {
  const { data } = useSQL(QUERIES.FUNCTIONS)
  const { name } = useParams()
  const sqlFunction = data.find((d) => d.name === name)

  return (
    <div
      style={{ height: 'calc(100vh - 66px - 53px)' }}
      className="overflow-auto"
    >
      <CodeEditor value={sqlFunction?.definition} />
    </div>
  )
}
