import React, { useMemo } from 'react'
import { useSelectedAccount } from '@/lib/AccountsContext'
import useConnections from '@/lib/data/useConnections'
import { DatabaseIcon, TableIcon } from '@heroicons/react/outline'
import useRecentTables from '@/lib/data/useRecentTables'
import { Link } from '@reach/router'

export default function DataExplorer() {
  const account = useSelectedAccount()
  const { data: connections } = useConnections(account)
  const { data: recentTables } = useRecentTables(account)

  const tablesWithConnections = useMemo(() => {
    if (!connections?.length || !recentTables?.length) {
      return []
    }

    const idMap = Object.fromEntries(connections.map((c) => [c.name, c.id]))
    return recentTables.map((t) => ({
      ...t,
      connectionId: idMap[t.connectionName]
    }))
  }, [connections, recentTables])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium text-gray-600">Data Explorer</h2>
      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-600">Recently used</h3>
        <Scroller>
          {tablesWithConnections.map((t) => (
            <li
              key={`${t.connectionId}/${t.fqn}`}
              className="flex-shrink-0 w-80 "
            >
              <TableCard table={t} />
            </li>
          ))}
        </Scroller>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-600">Connections</h3>
        <Scroller>
          {(connections || []).map((c) => (
            <li key={c.id} className="flex-shrink-0 w-80">
              <ConnectionCard connection={c} />
            </li>
          ))}
        </Scroller>
      </div>
    </div>
  )
}

function Scroller({ children, ...props }) {
  return (
    <div className="relative" {...props}>
      <ul
        style={{ WebkitOverflowScrolling: 'touch' }}
        className="hide-scrollbar px-2 py-3 flex items-stretch justify-start overflow-x-auto max-w-full space-x-4"
      >
        {children}
      </ul>
    </div>
  )
}

function ConnectionCard({ connection }) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 shadow-md bg-white max-w-sm">
      <h4 className="text-gray-700 text-base flex items-center space-x-2 mb-3">
        <DatabaseIcon className="w-4 h-4 text-gray-400" />
        <span>{connection.provider_id}</span>
      </h4>
      <Link to={connection.id}>
        <p className="text-gray-800 text-xl leading-tight font-medium truncate">
          {connection.name}
        </p>
      </Link>
    </div>
  )
}

function TableCard({ table }) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 shadow-md bg-white max-w-sm">
      <h4 className="text-gray-700 text-base flex items-center space-x-2 mb-3">
        <TableIcon className="w-4 h-4 text-gray-400" />
        <span>{table.connectionProviderId}</span>
      </h4>
      <Link to={`${table.connectionId}/${table.fqn.replace(/\./g, '/')}`}>
        <p className="text-gray-800 text-xl leading-tight font-medium truncate">
          {table.name}
        </p>
      </Link>
    </div>
  )
}
