import { QUERIES } from '@/lib/asideQueries'
import useSQL from '@/lib/useSQL'
import React, { useMemo, useState } from 'react'
import Collapsible from '@/components/common/Collapsible'
import List from '@/components/common/List'
import Tag from '@/components/common/Tag'
import RefreshButton from '../common/RefreshButton'
import SearchBox from '../common/SearchBox'
import useDebounce from '@/lib/useDebounce'
import { useParams } from '@reach/router'

export default function SequenceList() {
  const { seqName } = useParams()
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

  function getTitle(d) {
    if (d.name === seqName) {
      return <span className="text-blue-700 font-semibold">{d.name}</span>
    } else {
      return d.name
    }
  }

  return (
    <Collapsible title="Sequences" badge={badge} corner={refresh}>
      {data.length && <SearchBox onChange={setSearch} />}
      <List
        items={data}
        getTitle={getTitle}
        getLink={(d) => `/seq/${d.name}`}
      />
    </Collapsible>
  )
}
