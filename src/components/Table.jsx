import React from 'react'
import DataTable from 'react-data-table-component'

const CELL_STYLE = {
  minWidth: '160px',
  maxWidth: '260px'
}

export default function Table({ columns = [], data, isLoading }) {
  const tableColumns = columns.map((c) => ({ ...c, ...CELL_STYLE, style: { padding: '8px 16px' } }))

  return (
    <DataTable
      keyField="cartodb_id"
      noHeader
      responsive
      pagination
      loading={isLoading}
      columns={tableColumns}
      data={data}
      customStyles={{
        headCells: {
          style: {
            ...CELL_STYLE,
            overflow: 'hidden',
            '& > div:hover': {
              color: 'initial'
            }
          }
        },
        pagination: {
          style: {
            '& select': {
              minWidth: '36px'
            },
            '& select + svg': {
              display: 'none'
            }
          }
        }
      }}
    />
  )
}
