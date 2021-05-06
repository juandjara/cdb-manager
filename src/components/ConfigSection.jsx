import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import Button from './Button'
import ConfigForm from './ConfigForm'
import Select from './Select'

const OPTS = [
  { apikey: '123435565', account: 'vodafone-admin-dev', label: 'Vodafone' },
  { apikey: '313565734', account: 'gap-demo', label: 'Site Planning' },
  {
    apikey: '890787894',
    account: 'clear-channel-dev',
    label: 'Clear Channel DEV'
  }
].map((opt) => ({ ...opt, value: opt.apikey }))

export default function ConfigSection() {
  const [config, setConfig] = useState(OPTS[0])
  const [formOpen, setFormOpen] = useState(false)

  function openNew() {
    setConfig({ label: 'New config' })
    openSelected()
  }

  function openSelected() {
    setFormOpen(true)
  }

  function handleDelete() {}

  function handleSave() {}

  return (
    <div className="px-4 py-6">
      <div className="flex items-baseline justify-between space-x-1">
        <label
          htmlFor="config_select"
          className="block text-sm font-medium text-gray-700"
        >
          Configuration
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
        <Select selected={config} onChange={setConfig} options={OPTS} />
      </div>
      <Transition
        show={formOpen}
        className="mt-8"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ConfigForm
          config={config}
          onClose={() => setFormOpen(false)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </Transition>
    </div>
  )
}
