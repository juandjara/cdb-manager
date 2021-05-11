import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React, { useMemo, useState } from 'react'
import Collapsible from '@/components/common/Collapsible'
import List from '@/components/common/List'
import Tag from '@/components/common/Tag'
import RefreshButton from '../common/RefreshButton'
import SearchBox from '../common/SearchBox'
import useDebounce from '@/lib/useDebounce'

export default function SequenceList() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data, isError, isFetching, refetch } = useSQL(QUERIES.SEQUENCES)
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
    <Collapsible title="Sequences" badge={badge} corner={refresh}>
      {data.length && <SearchBox onChange={setSearch} />}
      <List items={data} getTitle="name" getLink={(d) => `/seq/${d.name}`} />
    </Collapsible>
  )
}
