import { XIcon } from '@heroicons/react/outline'
import React from 'react'
import Button from '@/components/common/Button'
import { Transition } from '@headlessui/react'
import SearchBox from './common/SearchBox'

export default function QueryListPanel({ onClose }) {
  return (
    <>
      <Transition
        show
        enter="opacity-0"
        enterFrom="ease-out transition-medium"
        enterTo="opacity-100"
        leave="opacity-100"
        leaveFrom="ease-out transition-medium"
        leaveTo="opacity-0"
      >
        <div className="z-10 fixed inset-0 transition-opacity">
          {/* eslint-disable-next-line */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black opacity-25"
          ></div>
        </div>
      </Transition>
      <aside className="transform top-0 right-0 w-96 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30">
        <header>
          <Button
            onClick={onClose}
            padding="p-2"
            color="gray"
            className="rounded-full m-2 absolute top-0 left-0 z-20"
          >
            <XIcon className="w-5 h-5" />
          </Button>
          <h3 className="text-xl font-medium py-3 pl-14">Query History</h3>
        </header>
        <div className="px-2">
          <SearchBox placeholder="Search query history" />
        </div>
      </aside>
    </>
  )
}
