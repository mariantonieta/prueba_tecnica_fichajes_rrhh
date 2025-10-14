import React from "react"
import { Table, Column } from "../ui/table"
import { useToast } from "../../hooks/use-toast"

export interface RequestsTableProps<T extends { id: string; status: string }> {
  requests?: T[] 
  role: "EMPLOYEE" | "RRHH"
  currentUserId: string
  columns: Column<T>[]
  onStatusChange?: (id: string, newStatus: string, comment?: string) => void
  handleReview?: (id: string, newStatus: string, comment?: string) => void
  userField?: keyof T
}

export function RequestsTable<T extends { id: string; status: string }>({
  requests = [], 
  role,
  currentUserId,
  columns,
  onStatusChange,
  handleReview,
  userField = "user_id" as keyof T,
}: RequestsTableProps<T>) {
  const { toast } = useToast()

  const safeRequests = Array.isArray(requests) ? requests : []

  const defaultHandleReview = (id: string, newStatus: string, comment = "") => {
    if (!onStatusChange) return
    onStatusChange(id, newStatus, comment)
    toast({
      title: `Solicitud ${newStatus}`,
      description: `La solicitud fue marcada como ${newStatus}.`,
      variant: "default",
    })
  }

  const reviewFn = handleReview || defaultHandleReview

  const enhancedColumns: Column<T>[] = [
    ...columns,
    ...(role === "RRHH" ? [{
      header: "Acciones",
      accessor: "actions",
      render: (_, row: T) => {
        const isOwnRequest = (row[userField] as unknown) === currentUserId
        if (isOwnRequest || !onStatusChange) {
          return <span className="text-gray-400 italic">Sin acciones</span>
        }

        return (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
              onClick={() => reviewFn(row.id, "approved", "Aprobado")}
            >
              Aprobar
            </button>
            <button
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              onClick={() => reviewFn(row.id, "rejected", "Rechazado")}
            >
              Rechazar
            </button>
          </div>
        )
      },
    }] : [])
  ]

  return <Table columns={enhancedColumns} data={safeRequests} />
}