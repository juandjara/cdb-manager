import React, { lazy, Suspense, useState } from 'react'
import CodeEditor from '@/components/common/CodeEditor'
import Button from '@/components/common/Button'
import useSQLMutation from '@/lib/useSQLMutation'
import Table from '@/components/Table'
import extractErrorMessage from '@/lib/extractErrorMessage'
import { ClockIcon, TableIcon } from '@heroicons/react/outline'
import executeSQL from '@/lib/executeSQL'
import { useSelectedAccount } from '@/lib/AccountsContext'
import { useAlertSetter } from '@/lib/AlertContext'
import downloadBlob from '@/lib/downloadBlob'
import { API_VERSIONS } from '@/components/aside/AccountForm'

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

function extractColumns(data, apiVersion) {
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
    return data.schema.map((field) => {
      const column = {
        title: field.name,
        key: field.name
      }

      if (field.type === 'number') {
        column.align = 'right'
      }
      if (field.type === 'geometry') {
        column.render = (value) => (value ? 'Geometry' : '')
      }

      return column
    })
  }
}

export default function SQLConsole() {
  const credentials = useSelectedAccount()
  const [query, setQuery] = useState(() => {
    const urlQuery = new URLSearchParams(window.location.search)
    return urlQuery.get('q') || ''
  })
  const [showMap, setShowMap] = useState(false)
  const setAlert = useAlertSetter()
  const mutation = useSQLMutation({ supressErrorAlert: true })

  const columns =
    mutation.isSuccess && extractColumns(mutation.data, credentials.apiVersion)

  async function downloadCSV() {
    try {
      const text = await executeSQL({
        query,
        credentials,
        options: { format: 'csv' }
      })
      downloadBlob(text, 'text/csv', 'carto-query.csv')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setAlert(extractErrorMessage(err))
    }
  }

  return (
    <div className="relative h-full p-6">
      <Suspense fallback={<p></p>}>
        {showMap ? (
          <MapOverlay onClose={() => setShowMap(false)} query={query} />
        ) : (
          <div></div>
        )}
      </Suspense>
      <div
        style={{ minHeight: '348px', maxHeight: 'calc(100vh - 254px)' }}
        className="overflow-auto border-2 border-gray-300 rounded-lg"
      >
        <CodeEditor
          value={query}
          onChange={setQuery}
          style={{ minHeight: 'inherit' }}
        />
      </div>
      <div className="mt-4 space-x-4">
        <Button
          disabled={mutation.isLoading}
          onClick={() => mutation.mutate(query)}
        >
          Run Query
        </Button>
        <Button onClick={() => setShowMap(true)}>View map</Button>
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
                <span>Total rows: {mutation.data.total_rows}</span>
              </p>
              <p className="flex items-center space-x-3">
                <ClockIcon className="h-6 w-6 text-green-500" />
                <span>Server time: {mutation.data.time}s</span>
              </p>
              <div>
                <Button className="mt-3" onClick={downloadCSV} color="green">
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
