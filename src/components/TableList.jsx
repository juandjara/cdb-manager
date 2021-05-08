import React from 'react'
import Collapsible from './Collapsible'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import Tag from './Tag'
import List from './List'

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
  const { data } = useSQL(QUERIES.TABLES)

  return (
    <Collapsible
      title="Tables / Views"
      badge={<Tag color="blue">{data && data.length}</Tag>}
    >
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
