import { useRef } from 'react'
import { useAccounts, useAccountsActions } from '@/lib/AccountsContext'
import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import AccountForm, { API_VERSIONS } from './AccountForm'
import Button from '@/components/common/Button'
import Select from '@/components/common/Select'
import { ACCOUNT_ACTIONS } from '@/lib/AccountsContext'
import { nanoid } from 'nanoid'
import downloadBlob from '@/lib/downloadBlob'
import { ACCOUNTS_KEY } from '@/lib/AccountsContext'
import { useAlertSetter } from '@/lib/AlertContext'
import { decodeToken } from '@/lib/authConfig'

function ImportButton({ onUpload }) {
  const inputRef = useRef()

  function toggleFile() {
    window.confirm(
      'Esto sobreescribira todas tus cuentas guardadas. ¿Estás seguro?'
    )
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  function handleFile(ev) {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = function handleImgLoad(ev) {
      const text = ev.target.result
      onUpload(text)
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <input
        id="profile_picture"
        className="hidden"
        type="file"
        onChange={handleFile}
        ref={inputRef}
      />
      <Button
        title="Import a JSON file with saved accounts"
        onClick={toggleFile}
        padding="px-3 py-1"
        textColor="text-indigo-700"
        backgroundColor="hover:bg-indigo-100"
      >
        Import
      </Button>
    </div>
  )
}

function renderAccountOption(account) {
  return (
    <span className="flex items-center justify-between">
      <span className="text-sm">{account.label}</span>
      <span className="text-xs">{account.apiVersion || API_VERSIONS.V2}</span>
    </span>
  )
}

export default function AccountConfig() {
  const [formOpen, setFormOpen] = useState(false)
  const accounts = useAccounts()
  const configActions = useAccountsActions()
  const selectedAccount = accounts.find((a) => a.selected)
  const setAlert = useAlertSetter()
  const isTokenExpired = !decodeToken(selectedAccount.accessToken)

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

  function importAccounts(jsonText) {
    try {
      const importData = JSON.parse(jsonText)
      configActions[ACCOUNT_ACTIONS.IMPORT](importData)
    } catch (err) {
      setAlert('Error parsing JSON. Invalid file')
      // eslint-disable-next-line
      console.error(err)
    }
  }

  function exportAccounts() {
    const accountsText = localStorage.getItem(ACCOUNTS_KEY) || '[]'
    downloadBlob(accountsText, 'application/json', 'cdb-manager-accounts.json')
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-baseline justify-between space-x-1">
        <label
          htmlFor="config_select"
          className="block text-sm font-medium text-gray-700"
        >
          Accounts
        </label>
        <span className="flex-auto"></span>
        <Button
          title="Create new account"
          onClick={openNew}
          padding="px-3 py-1"
          backgroundColor="hover:bg-gray-100"
          textColor="text-gray-700"
        >
          New
        </Button>
        <Button
          title="Edit selected account"
          onClick={openSelected}
          padding="px-3 py-1"
          backgroundColor="hover:bg-blue-100"
        >
          Edit
        </Button>
        <ImportButton onUpload={importAccounts} />
        <Button
          title="Export all saved accounts as JSON"
          onClick={exportAccounts}
          padding="px-3 py-1"
          textColor="text-indigo-700"
          backgroundColor="hover:bg-indigo-100"
        >
          Export
        </Button>
      </div>
      <div
        title={
          isTokenExpired
            ? 'The stored token for this account is expired. Please refresh it.'
            : ''
        }
      >
        <Select
          className="mt-3"
          valueKey="id"
          hasError={isTokenExpired}
          selected={selectedAccount}
          onChange={setSelectedAccount}
          options={accounts}
          renderLabel={renderAccountOption}
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
          key={selectedAccount?.id || 'new'}
          config={selectedAccount}
          onClose={() => setFormOpen(false)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </Transition>
    </div>
  )
}
