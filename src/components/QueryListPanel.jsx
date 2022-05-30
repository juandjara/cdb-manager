import {
  StarIcon,
  PencilIcon,
  PlayIcon,
  SelectorIcon,
  XIcon,
  CheckIcon
} from '@heroicons/react/outline'
import React, { useState } from 'react'
import Button from '@/components/common/Button'
import { Transition } from '@headlessui/react'
import SearchBox from './common/SearchBox'
import {
  QUERY_HISTORY_ACTIONS,
  useQueryHistoryActions,
  useSelectedAccount
} from '@/lib/AccountsContext'
import Input from './common/Input'

export default function QueryListPanel({ query, setQuery, onClose }) {
  const account = useSelectedAccount()
  const history = account.queries || []
  const actions = useQueryHistoryActions()
  const [selectedIndex, setSelectedIndex] = useState(-1)

  function toggleIndex(index) {
    const newIndex = index === selectedIndex ? -1 : index
    setSelectedIndex(newIndex)
  }

  function handlePasteQuery(entry) {
    setQuery(entry.query)
    onClose()
  }

  function handleNameChange(name, entry) {
    actions[QUERY_HISTORY_ACTIONS.UPDATE]({
      ...entry,
      name
    })
  }

  // eslint-disable-next-line
  function handleFavorite(entry) {}

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
        <header className="flex items-center justify-start">
          <Button
            onClick={onClose}
            padding="p-2"
            color="gray"
            className="rounded-full m-2 ml-3"
          >
            <XIcon className="w-5 h-5" />
          </Button>
          <div className="py-3 pl-2">
            <h3 className="text-xl font-medium">Query History</h3>
            <p className="font-medium text-gray-500">{account.label}</p>
          </div>
        </header>
        <div className="px-2">
          <SearchBox placeholder="Search query history" />
        </div>
        <ul className="my-2">
          {history.slice(0, 100).map((entry, index) => (
            <QueryHistoryItem
              key={entry.query}
              entry={entry}
              isSelected={entry.query === query}
              showQuery={index === selectedIndex}
              toggleShowQuery={() => toggleIndex(index)}
              onPasteQuery={() => handlePasteQuery(entry)}
              onChangeName={(ev) => handleNameChange(ev, entry)}
              onFavorite={() => handleFavorite(entry)}
            />
          ))}
        </ul>
      </aside>
    </>
  )
}

function QueryHistoryItem({
  entry,
  showQuery,
  isSelected,
  toggleShowQuery,
  onPasteQuery,
  onChangeName,
  onFavorite
}) {
  const [isEditMode, setEditMode] = useState(false)
  const [tempName, setTempName] = useState('')

  function toggleEdit() {
    setTempName(entry.name)
    setEditMode(true)
  }

  function confirmEdit() {
    onChangeName(tempName)
    setTempName(null)
    setEditMode(false)
  }

  return (
    <li className={`py-2 px-4`.concat(isSelected ? ' bg-blue-50' : '')}>
      <header className="flex items-center">
        <Button
          onClick={toggleShowQuery}
          title="Expand query"
          padding="p-1"
          backgroundColor="bg-transparent hover:bg-gray-100"
          textColor="text-gray-400"
          className="rounded-sm m-0 mr-2 -ml-2"
        >
          <SelectorIcon className="w-5 h-5" />
        </Button>
        {isEditMode ? (
          <>
            <Input
              onChange={(ev) => setTempName(ev.target.value)}
              value={tempName}
              className="flex-grow"
            />
            <Button
              title="Save"
              padding="p-2"
              backgroundColor="bg-transparent hover:bg-gray-100"
              textColor="text-gray-400"
              className="rounded-sm m-0 ml-1"
              onClick={confirmEdit}
            >
              <CheckIcon className="w-5 h-5" />
            </Button>
            <Button
              title="Cancel"
              padding="p-2"
              backgroundColor="bg-transparent hover:bg-gray-100"
              textColor="text-gray-400"
              className="rounded-sm m-0 ml-1"
              onClick={() => setEditMode(false)}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex-grow text-sm">
              <h3 className="text-gray-500 font-semibold">{entry.name}</h3>
              <p className="text-gray-400 font-medium">
                Run at {new Date(entry.updated_at).toLocaleString()}
              </p>
            </div>
            <Button
              title="Paste to SQL Console"
              padding="p-2"
              backgroundColor="bg-transparent hover:bg-gray-100"
              textColor="text-gray-400"
              className="rounded-sm m-0 ml-1"
              onClick={onPasteQuery}
            >
              <PlayIcon className="w-5 h-5" />
            </Button>
            <Button
              title="Edit query name"
              padding="p-2"
              backgroundColor="bg-transparent hover:bg-gray-100"
              textColor="text-gray-400"
              className="rounded-sm m-0 ml-1"
              onClick={toggleEdit}
            >
              <PencilIcon className="w-5 h-5" />
            </Button>
            <Button
              title="Mark as favorite"
              padding="p-2"
              backgroundColor="bg-transparent hover:bg-gray-100"
              textColor="text-gray-400"
              className="rounded-sm m-0 ml-1"
              onClick={onFavorite}
            >
              <StarIcon className="w-5 h-5" />
            </Button>
          </>
        )}
      </header>
      {showQuery && (
        <pre className="bg-gray-50 my-2 py-2 px-3 rounded-md block whitespace-pre overflow-x-scroll">
          <code className="language-sql">{entry.query}</code>
        </pre>
      )}
    </li>
  )
}
