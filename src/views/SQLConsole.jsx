import React, { lazy, Suspense, useState, useMemo, useEffect } from 'react'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'
import useSQLMutation from '@/lib/useSQLMutation'
import Table from '@/components/Table'
import extractErrorMessage from '@/lib/extractErrorMessage'
import { ClockIcon, TableIcon } from '@heroicons/react/outline'
import executeSQL from '@/lib/executeSQL'
import {
  ACCOUNT_ACTIONS,
  useAccountsActions,
  useSelectedAccount
} from '@/lib/AccountsContext'
import { useAlertSetter } from '@/lib/AlertContext'
import downloadBlob from '@/lib/downloadBlob'
import { API_VERSIONS } from '@/components/aside/AccountForm'
import { useNavigate } from '@reach/router'

const QueryListPanel = lazy(() => import('@/components/QueryListPanel'))
const MapOverlay = lazy(() => import('@/components/MapOverlay'))

function Panel({ children, color }) {
  return (
    <div
      className={`space-y-3 mb-4 rounded-lg bg-${color}-50 text-${color}-900 text-base py-4 px-5`}
    >
      {children}
    </div>
  )
}

function extractColumnsFromRows(rows) {
  if (rows.length) {
    const keys = Object.keys(rows[0])
    return keys.map((k) => ({ title: k, key: k }))
  }
  return []
}

function extractColumnsFromMetadata(data, apiVersion) {
  if (apiVersion === API_VERSIONS.V2) {
    return Object.keys(data.fields).map((field) => {
      const type = data.fields[field].type
      const column = {
        title: field,
        key: field
      }

      if (type === 'number') {
        column.align = 'right'
      }
      if (type === 'geometry') {
        column.render = (value) => (value ? 'Geometry' : '')
      }

      return column
    })
  }
  if (apiVersion === API_VERSIONS.V3) {
    if (!data.schema || data.schema.length === 0) {
      return extractColumnsFromRows(data.rows)
    }
    return data.schema.map((field) => {
      const column = {
        title: field.name,
        key: field.name
      }

      if (field.type === 'number') {
        column.align = 'right'
      }
      if (field.type === 'geometry') {
        column.render = (value) => <GeometryColumnRender value={value} />
        column.render.displayName = 'GeometryColumnRenderApplied'
      }

      return column
    })
  }
}

function GeometryColumnRender({ value }) {
  const [expanded, setExpanded] = useState(false)

  if (!value) {
    return null
  }

  return (
    // eslint-disable-next-line
    <span
      title={expanded ? 'Click to hide' : 'Click to reveal content'}
      aria-label={expanded ? 'Click to hide' : 'Click to reveal content'}
      style={{ maxHeight: 200 }}
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer overflow-auto block break-all whitespace-pre-wrap"
    >
      {expanded ? value : 'Geometry'}
    </span>
  )
}
GeometryColumnRender.displayName = 'GeometryColumnRender'

function extractColumns(data, apiVersion) {
  try {
    return extractColumnsFromMetadata(data, apiVersion)
  } catch (err) {
    return extractColumnsFromRows(data.rows)
  }
}

function getURLQuery() {
  const urlParams = new URLSearchParams(window.location.search)
  const urlQuery = urlParams.get('q')
  return urlQuery
}

function useCurrentQuery() {
  const account = useSelectedAccount()
  return useMemo(() => {
    const urlQuery = getURLQuery()
    const savedQuery = account?.currentQuery

    if (urlQuery) {
      return urlQuery
    }
    if (savedQuery) {
      return savedQuery
    }

    return ''
  }, [account])
}

export default function SQLConsole() {
  const account = useSelectedAccount()
  const query = useCurrentQuery()
  const [showMap, setShowMap] = useState(false)
  const [queryListOpen, setQueryListOpen] = useState(false)
  const setAlert = useAlertSetter()
  const mutation = useSQLMutation({ supressErrorAlert: true })
  const actions = useAccountsActions()
  const navigate = useNavigate()

  const columns =
    mutation.isSuccess && extractColumns(mutation.data, account.apiVersion)

  async function downloadCSV() {
    try {
      const text = await executeSQL({
        query,
        credentials: account,
        options: { format: 'csv' }
      })
      downloadBlob(text, 'text/csv', 'carto-query.csv')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setAlert(extractErrorMessage(err))
    }
  }

  function setQuery(query) {
    if (getURLQuery()) {
      navigate('/console')
      setTimeout(() => {
        actions[ACCOUNT_ACTIONS.UPDATE]({ id: account.id, currentQuery: query })
      })
    } else {
      actions[ACCOUNT_ACTIONS.UPDATE]({ id: account.id, currentQuery: query })
    }
  }

  useEffect(() => {
    mutation.reset()
  }, [account?.id])

  if (!account) {
    return (
      <div className="p-4">
        <p className="text-xl font-medium text-gray-500">
          Select an account in the left panel to get started
        </p>
      </div>
    )
  }

  const isV3 = account?.apiVersion === API_VERSIONS.V3

  function disabledForV3(text = '') {
    return isV3
      ? `${text} is only available for CARTO 2 accounts at this moment`
      : ''
  }

  return (
    <div className="relative h-full p-6">
      <Suspense fallback="">
        {queryListOpen ? (
          <QueryListPanel
            onClose={() => setQueryListOpen(false)}
            query={query}
            setQuery={setQuery}
          />
        ) : (
          <div></div>
        )}
      </Suspense>
      <Suspense fallback="">
        {showMap ? (
          <MapOverlay onClose={() => setShowMap(false)} query={query} />
        ) : (
          <div></div>
        )}
      </Suspense>
      <Button
        onClick={() => setQueryListOpen(true)}
        title="Histórico de queries"
        padding="p-2"
        color="blue"
        className="rounded-sm m-2 absolute top-6 right-10 z-10"
      >
        <ClockIcon className="w-6 h-6" />
      </Button>
      <div
        style={{ minHeight: '348px', maxHeight: 'calc(100vh - 254px)' }}
        className="relative overflow-auto border-2 border-gray-300 rounded-lg"
      >
        <CodeEditor
          value={query}
          onChange={setQuery}
          style={{ minHeight: 'inherit' }}
        />
      </div>
      <div className="mt-4 space-x-4">
        <Button
          disabled={!query || mutation.isLoading}
          onClick={() => mutation.mutate(query)}
        >
          Run Query
        </Button>
        <span title={disabledForV3('View map')}>
          <Button disabled={!query || isV3} onClick={() => setShowMap(true)}>
            View map
          </Button>
        </span>
      </div>

      <div className="mt-8">
        {mutation.isLoading && <Panel color="yellow">Loading ...</Panel>}
        {mutation.isError && (
          <Panel color="red">{extractErrorMessage(mutation.error)}</Panel>
        )}
        {mutation.isSuccess && (
          <>
            <Panel color="green">
              <p className="flex items-center space-x-3">
                <TableIcon className="h-6 w-6 text-green-500" />
                <span>
                  Total rows:{' '}
                  {mutation.data.total_rows || mutation.data.rows.length}
                </span>
              </p>
              {mutation.data.time && (
                <p className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-green-500" />
                  <span>Server time: {mutation.data.time}s</span>
                </p>
              )}
              <div title={disabledForV3('Download CSV')}>
                <Button
                  className="mt-3"
                  disabled={isV3}
                  onClick={downloadCSV}
                  color="green"
                >
                  Download CSV
                </Button>
              </div>
            </Panel>
            <Table columns={columns} data={mutation.data.rows} />
          </>
        )}
      </div>
    </div>
  )
}
