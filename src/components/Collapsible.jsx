import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

function iconStyle(open, color) {
  return `${open ? 'transform rotate-180' : ''} w-5 h-5 text-${color}-500`
}

function triggerStyle(open, color) {
  const focus = `focus:outline-none focus-visible:ring focus-visible:ring-${color}-500 focus-visible:ring-opacity-75`
  const background = open ? `bg-${color}-50` : `hover:bg-${color}-50`
  const layout = `flex justify-between w-full p-2 pr-3 rounded-lg font-medium text-left text-${color}-900`
  return [focus, background, layout].join(' ')
}

export default function Collapsible({
  title,
  badge,
  children,
  color = 'blue'
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={triggerStyle(open, color)}>
            <span>{title}</span>
            <ChevronUpIcon className={iconStyle(open, color)} />
          </Disclosure.Button>
          <Disclosure.Panel style={{ margin: 0 }}>{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
