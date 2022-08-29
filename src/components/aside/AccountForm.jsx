import React, { useMemo, useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import executeSQL from '@/lib/executeSQL'
import { useAlertSetter } from '@/lib/AlertContext'
import extractErrorMessage from '@/lib/extractErrorMessage'
import SelectSimple from '../common/SelectSimple'
import authConfig from '@/lib/authConfig'
import { useMutation, useQuery } from 'react-query'
import { Auth0Client } from '@auth0/auth0-spa-js'
import { XIcon } from '@heroicons/react/outline'
import axios from 'axios'
import Select from '../common/Select'

export const API_VERSIONS = {
  V2: 'v2',
  V3: 'v3'
}

export const AUTH_MODES = {
  RAW: 'RAW',
  OAUTH: 'OAUTH'
}

export const GCP_REGIONS = ['us-east1', 'eu-west1', 'au-se1', 'as-ne1']
const DEFAULT_REGION = GCP_REGIONS[0]
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
      apiVersion: (config && config.apiVersion) || API_VERSIONS.V3,
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
      accessToken: config && config.accessToken,
      authMode: (config && config.authMode) || AUTH_MODES.RAW
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
          buttonShadow="shadow-sm"
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
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700"
            >
              Region
            </label>
            <SelectSimple
              id="region"
              selected={form.region}
              onChange={updateSelect('region')}
              options={GCP_REGIONS}
              buttonShadow="shadow-sm"
            />
          </div>
          <ConnectionInput form={form} setForm={setForm} />
          <AuthInput form={form} setForm={setForm} />
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

function renderConnectionOption(opt) {
  return (
    <span className="flex items-center justify-between">
      <span className="text-sm">{opt.label}</span>
      <span className="text-xs">{opt.provider}</span>
    </span>
  )
}

function ConnectionInput({ form, setForm }) {
  const decodedToken = useMemo(
    () => decodeToken(form.accessToken),
    [form.accessToken]
  )
  const tokenIsValid = !!decodedToken

  const { data: options } = useQuery(
    ['connections', form.region, form.accessToken],
    () => {
      const url = `https://workspace-gcp-${form.region}.app.carto.com/connections`
      const headers = {
        Authorization: `Bearer ${form.accessToken}`
      }

      return axios.get(url, { headers }).then((res) => res.data)
    },
    { enabled: tokenIsValid }
  )

  function update(key, value) {
    setForm((form) => ({ ...form, [key]: value }))
  }

  const formattedOptions = useMemo(() => {
    return (options || []).map((opt) => ({
      value: opt.name,
      label: opt.name,
      provider: opt.carto_dw ? 'CARTO' : opt.provider_id
    }))
  }, [options])

  const selectedConnection = formattedOptions.find(
    (opt) => opt.value === form.connection
  )

  return options?.length ? (
    <div>
      <label
        htmlFor="connection"
        className="block text-sm font-medium text-gray-700"
      >
        Connection
      </label>
      <Select
        id="connection"
        selected={selectedConnection}
        onChange={(value) => update('connection', value?.value)}
        options={formattedOptions}
        buttonShadow="shadow-sm"
        renderLabel={renderConnectionOption}
      />
    </div>
  ) : (
    <Input
      id="connection"
      label="Connection"
      value={form.connection}
      onChange={(ev) => update('connection', ev.target.value)}
      placeholder="carto_dw"
    />
  )
}

function AuthInput({ form, setForm }) {
  function update(key, value) {
    setForm((form) => ({ ...form, [key]: value }))
  }

  return form.authMode === AUTH_MODES.RAW ? (
    <Input
      id="accessToken"
      label="Access Token"
      value={form.accessToken || ''}
      onChange={(ev) => update('accessToken', ev.target.value)}
      corner={
        <Button
          type="button"
          padding="px-2 py-1"
          backgroundColor="bg-transparent"
          onClick={() => update('authMode', AUTH_MODES.OAUTH)}
        >
          OAuth Login
        </Button>
      }
    />
  ) : (
    <OAuthConfig
      form={form}
      setForm={setForm}
      onToggle={() => update('authMode', AUTH_MODES.RAW)}
    />
  )
}

const auth0Client = new Auth0Client({
  domain: authConfig.domain,
  audience: authConfig.audience,
  cacheLocation: 'localstorage',
  client_id: authConfig.clientId,
  redirect_uri: window.location.origin,
  scope: authConfig.scopes.join(' ')
})

function decodeToken(token) {
  if (!token) {
    return null
  }

  let info = null
  try {
    info = JSON.parse(window.atob(token.split('.')[1]))
  } catch (e) {
    // pass
  }

  const now = new Date().getTime() + 1000 // 1s margin
  const expireMS = info?.exp * 1000
  const isValid = expireMS > now

  return (
    info &&
    isValid && {
      id: info['http://app.carto.com/account_id'],
      email: info['http://app.carto.com/email'],
      permissions: info.permissions,
      expireMS
    }
  )
}

function OAuthConfig({ form, setForm, onToggle }) {
  const setAlert = useAlertSetter()
  const decodedToken = useMemo(
    () => decodeToken(form.accessToken),
    [form.accessToken]
  )

  const mutation = useMutation(
    async () => {
      const token = await auth0Client.getTokenWithPopup()
      update('accessToken', token)
    },
    {
      onError: (err) => {
        setAlert(`Error loggin in ${err}`)
        // eslint-disable-next-line
        console.error(err)
      }
    }
  )

  function login() {
    mutation.mutate()
  }

  function logout() {
    update('accessToken', '')
    auth0Client.logout({
      returnTo: window.location.origin
    })
  }

  function update(key, value) {
    setForm((form) => ({ ...form, [key]: value }))
  }

  const isAuthenticated = !!decodedToken

  return (
    <div className="bg-gray-100 bg-opacity-75 rounded-xl p-3 relative">
      <Button
        onClick={onToggle}
        padding="p-1"
        color="gray"
        className="rounded-full absolute -top-1 -right-1"
      >
        <XIcon className="w-4 h-4" />
      </Button>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">OAuth Config</p>
        <div className="flex-grow"></div>
        {/* <div className="border h-6 border-gray-300 mx-2"></div> */}
        <Button
          type="button"
          padding="px-2 py-1"
          backgroundColor="bg-transparent"
          onClick={login}
        >
          {isAuthenticated ? 'Refresh' : 'Login'}
        </Button>
        {isAuthenticated && (
          <Button
            type="button"
            padding="px-2 py-1"
            backgroundColor="bg-transparent"
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </div>
      <Input
        id="accessToken"
        label="Access Token"
        className="mt-4"
        value={form.accessToken}
        disabled
      />
    </div>
  )
}
