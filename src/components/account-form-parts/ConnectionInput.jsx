import { decodeToken } from '@/lib/authConfig'
import axios from 'axios'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import Select from '@/components/common/Select'
import Input from '@/components/common/Input'

function renderConnectionOption(opt) {
  return (
    <span className="flex items-center justify-between">
      <span className="text-sm">{opt.label}</span>
      <span className="text-xs">{opt.provider}</span>
    </span>
  )
}

export default function ConnectionInput({ form, setForm }) {
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
