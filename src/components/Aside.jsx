import React from 'react'
import AccountConfig from './AccountConfig'
import Collapsible from './Collapsible'
import TableList from './TableList'

export default function Aside() {
  return (
    <aside className="w-96 border-r border-gray-200 shadow-lg">
      <AccountConfig />
      <nav className="space-y-4 p-3">
        <p className={`p-2 pr-3 rounded-lg font-medium text-left text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75`}>
          SQL Console
        </p>
        <TableList />
        <Collapsible title="Functions">Desplegable 1</Collapsible>
        <Collapsible title="Sequences">Desplegable 1</Collapsible>
      </nav>
    </aside>
  )
}
