import React from 'react'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import Collapsible from '@/components/common/Collapsible'
import Tag from '@/components/common/Tag'
import List from '@/components/common/List'
import RefreshButton from '../common/RefreshButton'

const RELKIND_LABEL = {
  r: '',
  v: 'View',
  m: 'Materialized view',
  p: 'Partitioned table'
}

function getTypeLabel({ table_type }) {
  return table_type in RELKIND_LABEL ? RELKIND_LABEL[table_type] : table_type
}

export default function TableList() {
  const { data, isError, isFetching, refetch } = useSQL(QUERIES.TABLES)
  const badge = <Tag color="blue">{data && data.length}</Tag>
  const refresh = ((data && data.length > 0) || isError) && (
    <RefreshButton loading={isFetching} onClick={refetch} />
  )

  return (
    <Collapsible title="Tables / Views" badge={badge} corner={refresh}>
      <List
        items={data}
        getTitle="name"
        getSubtitle={(d) => (
          <>
            <span className="text-sm mr-1">{d.row_count.toLocaleString()}</span>
            <span className="text-xs text-gray-500">Rows</span>
          </>
        )}
        getSecondary={getTypeLabel}
      />
    </Collapsible>
  )
}
