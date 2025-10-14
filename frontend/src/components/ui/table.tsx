import React from "react"

export interface Column<T> {
  header: string
  accessor: keyof T | string
  render?: (value: any, row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data?: T[] 
}

export function Table<T extends { id: string }>({ 
  columns, 
  data = [] 
}: TableProps<T>) {
    const safeData = Array.isArray(data) ? data : []

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeData.length > 0 ? (
            safeData.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="border border-gray-200 px-4 py-2 text-sm text-gray-600"
                  >
                    {column.render 
                      ? column.render(row[column.accessor as keyof T], row)
                      : String(row[column.accessor as keyof T] || "")
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="border border-gray-200 px-4 py-4 text-center text-sm text-gray-500"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}