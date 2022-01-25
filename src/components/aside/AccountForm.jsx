import React, { useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import executeSQL from '@/lib/executeSQL'
import { useAlertSetter } from '@/lib/AlertContext'
import extractErrorMessage from '@/lib/extractErrorMessage'
import SelectSimple from '../common/SelectSimple'

export const API_VERSIONS = {
  V2: 'v2',
  V3: 'v3'
}

const DEFAULT_REGION = 'us-east1'
const DEFAULT_CONNECTION = 'carto_dw'

export default function AccountForm({
  config,
  onClose,
  onSave,
  onDelete,
  innerRef
}) {
  const isNew = !config
  const [form, setForm] = useState(() => {
    const baseFields = {
      id: config && config.id,
      apiVersion: (config && config.apiVersion) || API_VERSIONS.V2,
      label: (config && config.label) || ''
    }
    const v2Config = {
      username: (config && config.username) || '',
      apikey: (config && config.apikey) || '',
      urlTemplate: (config && config.urlTemplate) || ''
    }
    const v3Config = {
      region: (config && config.region) || DEFAULT_REGION,
      connection: (config && config.connection) || DEFAULT_CONNECTION,
      accessToken: config && config.accessToken
    }
    const fields =
      baseFields.apiVersion === API_VERSIONS.V2 ? v2Config : v3Config

    return {
      ...baseFields,
      ...fields
    }
  })
  const [loading, setLoading] = useState(false)
  const setAlert = useAlertSetter()

  const update = (key) => (ev) =>
    setForm((form) => ({ ...form, [key]: ev.target.value }))

  const updateSelect = (key) => (opt) =>
    setForm((form) => ({ ...form, [key]: opt }))

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    try {
      await validateAccount()
      setLoading(false)
      onSave(form)
    } catch (err) {
      // eslint-disable-next-line
      console.error('[AccountForm.jsx] Error validating account', err)
      setLoading(false)
      setAlert(`Invalid credentials: ${extractErrorMessage(err)}`)
    }
  }

  async function validateAccount() {
    return executeSQL({
      query: 'SELECT 1',
      credentials: form
    })
  }

  return (
    <form className="space-y-6" ref={innerRef} onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="apiVersion"
          className="block text-sm font-medium text-gray-700"
        >
          API Version
        </label>
        <SelectSimple
          id="apiVersion"
          className="mt-3"
          selected={form.apiVersion}
          onChange={updateSelect('apiVersion')}
          options={Object.values(API_VERSIONS)}
        />
      </div>
      <Input
        id="label"
        label="Name (for reference only)"
        value={form.label}
        onChange={update('label')}
        placeholder="New account"
      />
      {form.apiVersion === API_VERSIONS.V2 && (
        <>
          <Input
            id="username"
            label="Account name"
            value={form.username}
            onChange={update('username')}
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
        </>
      )}
      {form.apiVersion === API_VERSIONS.V3 && (
        <>
          <Input
            id="region"
            label="Region"
            value={form.region}
            onChange={update('region')}
            placeholder="us-east1"
          />
          <Input
            id="connection"
            label="Connection"
            value={form.connection}
            onChange={update('connection')}
            placeholder="carto_dw"
          />
          <Input
            id="accessToken"
            label="Access Token"
            value={form.accessToken}
            onChange={update('accessToken')}
          />
        </>
      )}
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
        <Button disabled={loading} type="submit" color="blue">
          Save
        </Button>
      </div>
    </form>
  )
}
