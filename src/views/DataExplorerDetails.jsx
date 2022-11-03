import React, { useMemo, useState } from 'react'
import { useSelectedAccount } from '@/lib/AccountsContext'
import useConnectionResource from '@/lib/data/useConnectionResource'
import { Link, useParams } from '@reach/router'
import {
  ChevronRightIcon,
  DatabaseIcon,
  TableIcon
} from '@heroicons/react/outline'
import useConnections from '@/lib/data/useConnections'
import Spinner from '@/components/common/Spinner'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

function Breadcrumb({ parts }) {
  return (
    <nav className="mt-2 flex gap-2 items-center justify-start">
      <div className="flex gap-1 items-center">
        <Link to="/explorer">Data Explorer</Link>
        <ChevronRightIcon className="w-4 h-4" />
      </div>
      {parts.map((part, index) => (
        <BreadCrumbPart
          key={part?.id || part}
          index={index}
          part={part}
          parts={parts}
        />
      ))}
    </nav>
  )
}

function BreadCrumbPart({ index, part, parts }) {
  const isFirst = index === 0
  const isLast = parts.length - 1 === index
  const link = `/explorer/${parts[0].id}/${parts.slice(1, index + 1).join('/')}`
  return (
    <div className="flex gap-1 items-center">
      <Link to={link}>{isFirst ? part.name : part}</Link>
      {isLast ? null : <ChevronRightIcon className="w-4 h-4" />}
    </div>
  )
}

export default function DataExplorerDetails() {
  const { connection, table } = useParams()
  const account = useSelectedAccount()
  const { data: connections } = useConnections(account)
  const selectedConnection = (connections || []).find(
    (c) => c.id === connection
  )
  const breadCrumbParts = [
    selectedConnection,
    ...(table || '').split('/')
  ].filter(Boolean)

  const { data, isFetching } = useConnectionResource(
    account,
    connection,
    table.replace(/\//g, '.')
  )

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium text-gray-600">Resource Explorer</h2>
      <Breadcrumb parts={breadCrumbParts} />
      {isFetching ? (
        <div className="my-4 mx-2">
          <Spinner size="6" color="text-blue-500" />
        </div>
      ) : data.type === 'table' ? (
        <TableDetails data={data} connection={selectedConnection} />
      ) : (
        <ResourceList data={data} />
      )}
    </div>
  )
}

function TableCard({ table, connection }) {
  return (
    <div className="py-3 max-w-md">
      <h4 className="text-gray-700 text-base flex items-center gap-2">
        <TableIcon className="w-4 h-4 text-gray-400" />
        <span>
          <span className="capitalize">{table.type}</span>
          {' · '}
          {connection.name}
        </span>
      </h4>
      <div className="flex items-baseline gap-2">
        <p className="text-gray-800 text-xl leading-tight font-medium truncate">
          {table.name}
        </p>
        <p className="mt-2 text-gray-500 font-medium">
          <span>{table.nrows} Rows</span>
          {table.size && (
            <>
              {' · '}
              <span>{formatSize(table.size)}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

function formatSize(size) {
  let formatted = `${size} b`
  if (size > 1024) {
    formatted = `${(size / 1024).toFixed(2)} KB`
  }
  if (size > 1024 * 1024) {
    formatted = `${(size / 1024 / 1024).toFixed(2)} MB`
  }
  if (size > 1024 * 1024 * 1024) {
    formatted = `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  return formatted
}

function TableDetails({ data, connection }) {
  let table = data.id
  if (data.provider === 'bigquery') {
    const [first, ...parts] = table.split('.')
    table = `\`${first}\`${parts.length > 0 ? '' : '.'}${parts.join('.')}`
  }

  const queryLink = `/console?q=SELECT * FROM ${table}`
  return (
    <div className="py-4">
      <TableCard table={data} connection={connection} />
      <p className="text-sm text-gray-500 font-medium mt-2 mb-1">Schema</p>
      <ul className="space-y-4 p-4 border border-gray-300 rounded-lg">
        {data.schema.map((s) => (
          <li key={s.name}>
            <p className="text-gray-600 font-medium">{s.type}</p>
            <p className="text-xl">{s.name}</p>
          </li>
        ))}
      </ul>
      <Link to={queryLink}>
        <Button className="mt-4">Query this table</Button>
      </Link>
    </div>
  )
}

function ResourceList({ data }) {
  const [search, setSearch] = useState('')
  const numResources = (data.children || []).length
  const filteredResources = useMemo(() => {
    const list = data.children || []
    const query = search.trim().toLowerCase()
    return search ? list.filter((d) => d.name.includes(query)) : list
  }, [search, data.children])
  const numFilteredResources = filteredResources.length
  const searchLabel = `${
    search ? `${numFilteredResources} of ${numResources}` : numResources
  } resources`

  return (
    <div className="mt-6">
      <Input
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
        className="mt-8 mb-2"
        placeholder="Search resources"
        label={searchLabel}
      />
      <ul>
        {filteredResources.length === 0 && (
          <p className="text-gray-600 p-1 font-medium">
            No resources to list here
          </p>
        )}
        {filteredResources.map((r) => (
          <ResourceListItem key={r.id} resource={r} />
        ))}
      </ul>
    </div>
  )
}

function ResourceListItem({ resource }) {
  const Icon = resource.type === 'table' ? TableIcon : DatabaseIcon
  const link = resource.id.replace(/\./g, '/')

  return (
    <li className="flex gap-3 items-center p-3 hover:bg-gray-100 rounded-lg mb-4">
      <Icon className="text-gray-600 w-6 h-6 flex-shrink-0" />
      <Link to={link} className="flex-grow">
        <p>{resource.name}</p>
      </Link>
    </li>
  )
}
