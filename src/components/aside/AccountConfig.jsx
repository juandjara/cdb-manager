import { useAccounts, useAccountsActions } from '@/lib/AccountsContext'
import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import AccountForm from './AccountForm'
import Button from '@/components/common/Button'
import Select from '@/components/common/Select'
import { ACCOUNT_ACTIONS } from '@/lib/AccountsContext'
import { nanoid } from 'nanoid'

export default function AccountConfig() {
  const [formOpen, setFormOpen] = useState(false)
  const accounts = useAccounts()
  const configActions = useAccountsActions()
  const selectedAccount = accounts.find((a) => a.selected)

  function setSelectedAccount(account) {
    configActions[ACCOUNT_ACTIONS.SELECT](account && account.id)
  }

  function openNew() {
    setSelectedAccount(null)
    setFormOpen(true)
  }

  function openSelected() {
    setFormOpen(true)
  }

  function handleDelete() {
    configActions[ACCOUNT_ACTIONS.DELETE](selectedAccount.id)
    setFormOpen(false)
    setSelectedAccount(null)
  }

  function handleSave(newConfig) {
    const isNew = !newConfig.id
    if (isNew) {
      newConfig.id = nanoid()
    }

    const action = isNew ? ACCOUNT_ACTIONS.CREATE : ACCOUNT_ACTIONS.UPDATE
    configActions[action](newConfig)
    setFormOpen(false)
    setSelectedAccount(newConfig)
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-baseline justify-between space-x-1">
        <label
          htmlFor="config_select"
          className="block text-sm font-medium text-gray-700"
        >
          Account
        </label>
        <span className="flex-auto"></span>
        <Button
          onClick={openNew}
          padding="px-3 py-1"
          backgroundColor="hover:bg-gray-100"
          textColor="text-gray-700"
        >
          New
        </Button>
        <Button
          onClick={openSelected}
          padding="px-3 py-1"
          backgroundColor="hover:bg-blue-100"
        >
          Edit
        </Button>
      </div>
      <div className="mt-2 relative rounded-md shadow-sm">
        <Select
          valueKey="id"
          selected={selectedAccount}
          onChange={setSelectedAccount}
          options={accounts}
        />
      </div>
      <Transition
        show={formOpen}
        className="mt-8"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <AccountForm
          config={selectedAccount}
          onClose={() => setFormOpen(false)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </Transition>
    </div>
  )
}
