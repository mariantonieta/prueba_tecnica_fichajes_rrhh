import React from "react";
import { Table, Column } from "..//ui/table";
import { StatusBadge } from "../ui/status-badge";
import {
  adjustmentService,
  AdjustmentStatusEnum,
} from "../../services/adjustmentServices";
import { useToast } from "../../hooks/use-toast";

export interface Request {
  id: string;
  type: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  statusLabel: string;
  userId: string;
  reason?: string;
}

interface RequestsTableProps {
  requests: Request[];
  role: "EMPLOYEE" | "RRHH";
  currentUserId: string;
  onStatusChange?: (
    id: string,
    newStatus: AdjustmentStatusEnum,
    reason?: string
  ) => void;
}

export function RequestsTable({
  requests,
  role,
  currentUserId,
  onStatusChange,
}: RequestsTableProps) {
  const { toast } = useToast();

  const handleReview = async (
    id: string,
    status: AdjustmentStatusEnum,
    reason: string = ""
  ) => {
    try {
      await adjustmentService.updateStatus(id, status, reason);

      toast({
        title: `Solicitud ${status.toLowerCase()}`,
        description: `La solicitud fue ${status.toLowerCase()}`,
        variant: "default",
      });

      if (onStatusChange) onStatusChange(id, status, reason);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error al revisar la solicitud",
        description: error.message || "Intenta nuevamente",
        variant: "destructive",
      });
    }
  };

  // 🔹 Definimos las columnas para Table<T>
  const columns: Column<Request>[] = [
    { header: "Tipo", accessor: "type" },
    { header: "Fecha", accessor: "date" },
    {
      header: "Estado",
      accessor: "status",
      render: (_, row) => (
        <StatusBadge status={row.status} label={row.statusLabel} />
      ),
    },
    { header: "Motivo", accessor: "reason", render: (val) => val || "-" },
  ];

  // 🔹 Si es RRHH, añadimos la columna de acciones
  if (role === "RRHH") {
    columns.push({
      header: "Acciones",
      accessor: "id", // usamos id solo como key
      render: (_, row) => {
        const isOwnRequest = row.userId === currentUserId;
        if (isOwnRequest || !onStatusChange)
          return <span className="text-gray-400 italic">Sin acciones</span>;

        return (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
              onClick={() =>
                handleReview(
                  row.id,
                  AdjustmentStatusEnum.APPROVED,
                  "Revisión aprobada"
                )
              }
            >
              Aprobar
            </button>
            <button
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
              onClick={() =>
                handleReview(
                  row.id,
                  AdjustmentStatusEnum.REJECTED,
                  "Revisión rechazada"
                )
              }
            >
              Rechazar
            </button>
          </div>
        );
      },
    });
  }

  return <Table columns={columns} data={requests} />;
}
