import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React from 'react'
import Collapsible from '@/components/common/Collapsible'
import List from '@/components/common/List'
import Tag from '@/components/common/Tag'
import RefreshButton from '../common/RefreshButton'

export default function SequenceList() {
  const { data, isFetching, refetch } = useSQL(QUERIES.SEQUENCES)
  const badge = <Tag color="blue">{data && data.length}</Tag>

  return (
    <Collapsible
      title="Sequences"
      badge={badge}
      corner={data && <RefreshButton loading={isFetching} onClick={refetch} />}
    >
      <List items={data} getTitle="name" />
    </Collapsible>
  )
}
