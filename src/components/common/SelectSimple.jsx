import React, { useMemo } from 'react'
import Select from './Select'

export default function SelectSimple({
  selected,
  onChange,
  options,
  ...props
}) {
  const opts = useMemo(
    () => options.map((opt) => ({ value: opt, label: opt })),
    [options]
  )
  const selectedOpt = useMemo(
    () => opts.find((opt) => opt.value === selected),
    [opts, selected]
  )
  return (
    <Select
      selected={selectedOpt}
      onChange={({ value }) => onChange(value)}
      options={opts}
      {...props}
    />
  )
}
