import React, { useMemo } from 'react'
import DataTable from 'react-data-table-component'

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
        maxWidth: '200px'
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
