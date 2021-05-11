import React from 'react'
import { Link } from '@reach/router'
import { FixedSizeList } from 'react-window'

function noop() {}

function applyAccesor(item, accesor) {
  return typeof accesor === 'function' ? accesor(item) : item[accesor]
}

function ItemList({
  style,
  index,
  items = [],
  getTitle = noop,
  getLink = noop,
  getSubtitle = noop,
  getSecondary = noop
}) {
  const d = items[index]
  return (
    <li key={d.id || index} style={style}>
      <Link
        to={applyAccesor(d, getLink)}
        className="hover:bg-blue-50 flex justify-between items-center px-4 py-2"
      >
        <div>
          <p className="text-base">{applyAccesor(d, getTitle)}</p>
          <p className="text-gray-500">{applyAccesor(d, getSubtitle)}</p>
        </div>
        <p className="text-sm mx-1">{applyAccesor(d, getSecondary)}</p>
      </Link>
    </li>
  )
}

const curryListItem = (listProps) => (rowProps) => (
  <ItemList {...listProps} {...rowProps} />
)

export default function List(props) {
  const count = props.items.length
  return (
    <ul className="max-h-96 overflow-auto text-gray-700 space-y-2 py-2 border-2 border-blue-100 shadow-sm rounded-lg mt-2">
      <FixedSizeList
        height={96 * 4}
        width={355}
        itemCount={count}
        itemSize={64}
      >
        {curryListItem(props)}
      </FixedSizeList>
      {count === 0 && <li className="text-sm text-gray-700 px-2">No data</li>}
    </ul>
  )
}
