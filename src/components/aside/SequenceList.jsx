import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React from 'react'
import Collapsible from './common/Collapsible'
import List from './common/List'
import Tag from './common/Tag'

export default function SequenceList() {
  const { data } = useSQL(QUERIES.SEQUENCES)

  return (
    <Collapsible
      title="Sequences"
      badge={<Tag color="blue">{data && data.length}</Tag>}
    >
      <List items={data} getTitle="name" />
    </Collapsible>
  )
}
