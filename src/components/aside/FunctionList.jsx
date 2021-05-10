import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React, { useMemo, useState } from 'react'
import RefreshButton from '@/components/common/RefreshButton'
import Collapsible from '@/components/common/Collapsible'
import List from '@/components/common/List'
import Tag from '@/components/common/Tag'
import SearchBox from '../common/SearchBox'
import useDebounce from '@/lib/useDebounce'

export default function FunctionList() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data, isError, isFetching, refetch } = useSQL(QUERIES.FUNCTIONS)
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
    <Collapsible title="Functions" badge={badge} corner={refresh}>
      {data.length && <SearchBox onChange={setSearch} />}
      <List
        items={data}
        getTitle="name"
        getLink={d => `/functions/${d.name}`}
      />
    </Collapsible>
  )
}
