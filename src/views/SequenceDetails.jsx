import useSQL from '@/lib/useSQL'
import { useParams } from '@reach/router'
import React from 'react'

export default function SequenceDetails() {
  const { seqName } = useParams()
  const { data } = useSQL(`SELECT last_value FROM ${seqName}`)
  const lastValue = data[0] && data[0].last_value

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{seqName}</h2>
      <p className="text-gray-500 text-sm">Last value: </p>
      <p className="text-lg">{lastValue}</p>
    </div>
  )
}
