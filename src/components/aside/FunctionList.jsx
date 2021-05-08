import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React from 'react'
import RefreshButton from '@/components/common/RefreshButton'
import Collapsible from '@/components/common/Collapsible'
import List from '@/components/common/List'
import Tag from '@/components/common/Tag'

export default function FunctionList() {
  const { data, isFetching, refetch } = useSQL(QUERIES.FUNCTIONS)
  const badge = <Tag color="blue">{data && data.length}</Tag>

  return (
    <Collapsible
      title="Functions"
      badge={badge}
      corner={data && <RefreshButton loading={isFetching} onClick={refetch} />}
    >
      <List items={data} getTitle="name" />
    </Collapsible>
  )
}
