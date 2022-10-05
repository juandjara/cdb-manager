import ConnectionInput from '@/components/account-form-parts/ConnectionInput'
import { useSelectedAccount } from '@/lib/AccountsContext'
import useConnections from '@/lib/useConnections'
import React, { useRef } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'
import { DatabaseIcon } from '@heroicons/react/outline'

export default function DataExplorer() {
  const account = useSelectedAccount()
  const { data: connections } = useConnections(account)

  function updateConnection() {}

  return (
    <div className="p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-600">Data Explorer</h2>
        <div className="w-64">
          <ConnectionInput form={account} setForm={updateConnection} />
        </div>
      </header>
      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-600">Recently used</h3>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-600">Connections</h3>
        <Scroller>
          {(connections || []).map((c) => (
            <li key={c.id} className="flex-shrink-0 w-60">
              <ConnectionCard connection={c} />
            </li>
          ))}
        </Scroller>
      </div>
    </div>
  )
}

const CARD_WIDTH = 240
// const CARD_HEIGHT = 120

function Scroller({ children, ...props }) {
  const ulRef = useRef()

  function scrollUL(amount) {
    if (ulRef.current) {
      ulRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative" {...props}>
      <ul
        ref={ulRef}
        style={{ WebkitOverflowScrolling: 'touch' }}
        className="hide-scrollbar px-2 py-3 flex items-stretch justify-start overflow-x-auto max-w-full space-x-4"
      >
        {children}
      </ul>
      <div className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-between">
        <button
          onClick={() => scrollUL(-CARD_WIDTH)}
          className="pointer-events-auto -ml-3 md:-ml-6 rounded-full p-2 bg-opacity-20 text-white bg-gray-200 hover:bg-opacity-50"
        >
          <p className="sr-only">Scroll Left</p>
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => scrollUL(CARD_WIDTH)}
          className="pointer-events-auto -mr-3 md:-mr-6 rounded-full p-2 bg-opacity-20 text-white bg-gray-200 hover:bg-opacity-50"
        >
          <p className="sr-only">Scroll Right</p>
          <ArrowRightIcon className="w-6 h-6" />
        </button>
      </div>
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
      <p className="text-gray-800 text-xl leading-tight font-medium">
        {connection.name}
      </p>
    </div>
  )
}
