import React, { useMemo } from 'react'
import Select from '@/components/common/Select'
import Input from '@/components/common/Input'
import useConnections from '@/lib/data/useConnections'

function renderConnectionOption(opt) {
  return (
    <span className="flex items-center justify-between">
      <span className="text-sm">{opt.label}</span>
      <span className="text-xs">{opt.provider}</span>
    </span>
  )
}

export default function ConnectionInput({ form, setForm }) {
  const { data: options } = useConnections(form)

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
