import React, { useEffect } from 'react'
import Collapsible from './Collapsible'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'

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
    <Collapsible title="Tables / Views">
      <ul className="max-h-96 overflow-auto text-gray-700 space-y-2 py-2">
        {(data || []).map((d) => (
          <li className="hover:bg-blue-50 rounded-lg flex justify-between items-center p-2" key={d.id}>
            <div>
              <p className="text-base">{d.name}</p>
              <p className="text-gray-500">
                <span className="text-sm mr-1">{d.row_count.toLocaleString()}</span>
                <span className="text-xs text-gray-500">Rows</span>
              </p>
            </div>
            <p className="text-sm mx-1">{getTypeLabel(d)}</p>
          </li>
        ))}
      </ul>
    </Collapsible>
  )
}
