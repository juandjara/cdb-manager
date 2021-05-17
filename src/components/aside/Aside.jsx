import { Link, useLocation } from '@reach/router'
import React from 'react'
import { buttonFocusStyle } from '@/components/common/Button'
import AccountConfig from './AccountConfig'
import FunctionList from './FunctionList'
import SequenceList from './SequenceList'
import TableList from './TableList'

export default function Aside() {
  const { pathname } = useLocation()
  const linkColor = pathname === '/console' ? 'bg-blue-50' : 'hover:bg-blue-50'

  return (
    <aside className="w-96 border-r border-gray-200 shadow-lg">
      <AccountConfig />
      <nav className="space-y-4 p-3">
        <Link
          to="/console"
          className={`block p-2 pr-3 rounded-lg font-medium text-left text-blue-900 ${linkColor} ${buttonFocusStyle}`}
        >
          SQL Console
        </Link>
        <TableList />
        <FunctionList />
        <SequenceList />
      </nav>
    </aside>
  )
}
