import { Link, useLocation } from '@reach/router'
import React from 'react'
import { buttonFocusStyle } from '@/components/common/Button'
import AccountConfig from './AccountConfig'
import FunctionList from './FunctionList'
import SequenceList from './SequenceList'
import TableList from './TableList'
import { useSelectedAccount } from '@/lib/AccountsContext'
import { API_VERSIONS } from './AccountForm'

export default function Aside() {
  const { pathname } = useLocation()
  const linkColor = pathname === '/console' ? 'bg-blue-50' : 'hover:bg-blue-50'
  const credentials = useSelectedAccount()
  const hasMetadata = credentials && credentials.apiVersion === API_VERSIONS.V2

  return (
    <aside className="w-96 border-r border-gray-200">
      <AccountConfig />
      <nav className="space-y-4 p-3">
        <Link
          to="/console"
          className={`block p-2 pr-3 rounded-lg font-medium text-left text-blue-900 ${linkColor} ${buttonFocusStyle}`}
        >
          SQL Console
        </Link>
        {hasMetadata && (
          <div>
            <TableList />
            <FunctionList />
            <SequenceList />
          </div>
        )}
      </nav>
    </aside>
  )
}
