import React, { useMemo } from 'react'
import DataTable from 'react-data-table-component'

const CELL_WIDTH = '260px'

export default function Table({ data, isLoading }) {
  const columns = useMemo(() => {
    if (!data[0]) {
      return []
    }

    const keys = Object.keys(data[0])
    return keys.map((key) => ({
      name: key,
      selector: key,
      style: {
        maxWidth: CELL_WIDTH
      }
    }))
  }, [data])

  return (
    <DataTable
      keyField="cartodb_id"
      noHeader
      responsive
      pagination
      loading={isLoading}
      columns={columns}
      data={data}
      customStyles={{
        headRow: {
          style: {
            '& div': {
              maxWidth: CELL_WIDTH
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
