import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { buttonFocusStyle } from './Button'

const DEFAULT_RENDER_LABEL = (opt) => opt.label

export default function Select({
  options = [],
  selected,
  onChange,
  placeholder,
  valueKey = 'value',
  className = '',
  buttonShadow = 'shadow-md',
  renderLabel = DEFAULT_RENDER_LABEL,
  hasError = false,
  id
}) {
  const buttonCN = [
    'relative h-9 w-full py-2 pl-3 pr-10',
    `sm:text-sm text-left bg-white rounded-lg border border-black border-opacity-10 cursor-default`,
    buttonShadow,
    buttonFocusStyle,
    hasError ? 'ring-2 ring-red-300 text-red-700' : ''
  ].join(' ')
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div id={id} className={`relative ${className}`}>
          <Listbox.Button className={buttonCN}>
            {selected ? (
              <span className="block truncate">{selected.label}</span>
            ) : (
              <span className="text-gray-500 block truncate">
                {placeholder}
              </span>
            )}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className={`w-5 h-5 ${
                  hasError ? 'text-red-400' : 'text-gray-400'
                }`}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute w-full z-10 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {options.map((opt) => (
                <Listbox.Option
                  key={opt[valueKey]}
                  value={opt}
                  className={({ active }) =>
                    `${
                      active ? 'text-yellow-900 bg-yellow-100' : 'text-gray-900'
                    }
                        cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {renderLabel(opt)}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? 'text-yellow-600' : 'text-yellow-600'
                          }
                              absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
