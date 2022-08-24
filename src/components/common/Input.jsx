import React from 'react'

export default function Input({
  id,
  label,
  value,
  onChange,
  corner,
  disabled = false,
  type = 'text',
  placeholder,
  ...props
}) {
  return (
    <div {...props}>
      {label || corner ? (
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          {corner}
        </div>
      ) : null}
      <div
        className={`relative rounded-md shadow-sm`.concat(
          label || corner ? ' mt-1' : ''
        )}
      >
        <input
          type={type}
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="disabled:opacity-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
