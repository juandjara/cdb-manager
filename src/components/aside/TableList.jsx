import React, { useMemo, useState } from 'react'
import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import Collapsible from '@/components/common/Collapsible'
import Tag from '@/components/common/Tag'
import List from '@/components/common/List'
import RefreshButton from '../common/RefreshButton'
import useDebounce from '@/lib/useDebounce'
import SearchBox from '../common/SearchBox'

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
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data, isError, isFetching, refetch } = useSQL(QUERIES.TABLES)
  const filteredData = useMemo(
    () =>
      data.filter((d) => {
        const name = d.name.toLowerCase()
        const query = debouncedSearch.toLowerCase()
        return query ? name.indexOf(query) !== -1 : true
      }),
    [data, debouncedSearch]
  )

  const badge = <Tag color="blue">{filteredData.length}</Tag>
  const refresh = (data.length || isError) && (
    <RefreshButton loading={isFetching} onClick={refetch} />
  )

  return (
    <Collapsible title="Tables / Views" badge={badge} corner={refresh}>
      {data.length && <SearchBox onChange={setSearch} />}
      <List
        items={filteredData}
        getTitle="name"
        getLink={(d) => `/table/${d.name}/${d.id}`}
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
