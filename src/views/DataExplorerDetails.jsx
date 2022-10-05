import React from 'react'
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
  const link = `/explorer/${parts[0].id}/${parts.slice(1, index + 1).join('.')}`
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
    ...(table || '').split('.')
  ].filter(Boolean)

  const { data: resources, isFetching } = useConnectionResource(
    account,
    connection,
    table
  )

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium text-gray-600">Resource Explorer</h2>
      <Breadcrumb parts={breadCrumbParts} />
      {isFetching ? (
        <div className="my-4 mx-2">
          <Spinner size="6" color="text-blue-500" />
        </div>
      ) : (
        <ul className="mt-6">
          {(resources || []).length === 0 && (
            <p className="text-gray-600 p-1 font-medium">
              No resources to list here
            </p>
          )}
          {(resources || []).map((r) => (
            <ResourceListItem key={r.id} resource={r} />
          ))}
        </ul>
      )}
    </div>
  )
}

function ResourceListItem({ resource }) {
  const Icon = resource.type === 'table' ? TableIcon : DatabaseIcon
  const link =
    resource.type === 'table' ? `/explore-table/${resource.name}` : resource.id
  return (
    <li className="flex gap-3 items-center p-3 hover:bg-gray-100 rounded-lg mb-4">
      <Icon className="text-gray-600 w-6 h-6 flex-shrink-0" />
      <Link to={link} className="flex-grow">
        <p>{resource.name}</p>
      </Link>
    </li>
  )
}
