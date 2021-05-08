import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React from 'react'
import Collapsible from './Collapsible'
import List from './List'
import Tag from './Tag'

export default function FunctionList() {
  const { data } = useSQL(QUERIES.FUNCTIONS)

  return (
    <Collapsible
      title="Functions"
      badge={<Tag color="blue">{data && data.length}</Tag>}>
      <List items={data} getTitle="name" />
    </Collapsible>
  )
}
