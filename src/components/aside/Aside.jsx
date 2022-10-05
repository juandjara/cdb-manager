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
  const credentials = useSelectedAccount()
  const version = credentials?.apiVersion
  const linkClassname = `block p-2 pr-3 rounded-lg font-medium text-left text-blue-900 ${buttonFocusStyle}`

  function linkColor(route) {
    return pathname === route ? 'bg-blue-50' : 'hover:bg-blue-50'
  }

  return (
    <aside className="w-96 border-r border-gray-200">
      <AccountConfig />
      <nav className="space-y-4 p-3">
        <Link
          to="/console"
          className={`${linkClassname} ${linkColor('/console')}`}
        >
          SQL Console
        </Link>
        {version === API_VERSIONS.V3 && (
          <Link
            to="/explorer"
            className={`${linkClassname} ${linkColor('/explorer')}`}
          >
            Data Explorer
          </Link>
        )}
        {version === API_VERSIONS.V2 && (
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
