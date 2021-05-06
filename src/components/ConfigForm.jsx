import React, { useState } from 'react'
import Button from './Button'
import Input from './Input'

export const buttonFocusStyle =
  'focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent'

export default function ConfigForm({
  config = {},
  onClose,
  onSave,
  onDelete,
  innerRef
}) {
  const isNew = !config.apikey
  const [form, setForm] = useState(() => ({
    label: config.label || '',
    account: config.account || '',
    apikey: config.apikey || '',
    urlTemplate: config.urlTemplate || ''
  }))

  const update = (key) => (ev) =>
    setForm((form) => ({ ...form, [key]: ev.target.value }))

  function handleSubmit(ev) {
    ev.preventDefault()
    onSave(form)
  }

  return (
    <form className="space-y-6" ref={innerRef} onSubmit={handleSubmit}>
      <Input
        id="label"
        label="Name (for reference only)"
        value={form.label}
        onChange={update('label')}
        placeholder="New config"
      />
      <Input
        id="account"
        label="Account name"
        value={form.account}
        onChange={update('account')}
        placeholder="public"
      />
      <Input
        id="api_key"
        label="API key"
        value={form.apikey}
        onChange={update('apikey')}
        placeholder="default_public"
      />
      <Input
        id="url_template"
        label="Server URL template"
        value={form.urlTemplate}
        onChange={update('urlTemplate')}
        placeholder="https://{user}.carto.com"
      />
      <div className="flex justify-end items-center space-x-4">
        {!isNew && (
          <Button type="button" onClick={onDelete} color="red">
            Delete
          </Button>
        )}
        <span className="flex-auto"></span>
        <Button type="button" onClick={onClose} color="gray">
          Cancel
        </Button>
        <Button type="submit" color="blue">
          Save
        </Button>
      </div>
    </form>
  )
}
