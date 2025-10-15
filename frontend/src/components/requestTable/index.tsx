import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card } from "../ui/card";

export interface RequestOut {
  id: string;
  full_name: string;
  type: string;
  date: string;
  status: "approved" | "rejected" | "pending";
  statusLabel: string;
  review_comment?: string;
}

interface RequestsTableProps {
  requests: RequestOut[];
  role: "EMPLOYEE" | "RRHH";
  onStatusChange?: (id: string, newStatus: "approved" | "rejected") => void;
  pageSize?: number;
}

export const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  role,
  onStatusChange,
  pageSize = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const getStatusClassName = (status: string): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "";
    }
  };

  const totalPages = Math.ceil(requests.length / pageSize);
  const paginatedRequests = requests.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <Card className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Comentario</TableHead>
              {role === "RRHH" &&
                paginatedRequests.some((r) => r.status === "pending") && (
                  <TableHead className="text-center">Acciones</TableHead>
                )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.full_name}
                </TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusClassName(request.status)}>
                    {request.statusLabel}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {request.review_comment || "—"}
                </TableCell>
                {role === "RRHH" && request.status === "pending" && (
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => onStatusChange?.(request.id, "approved")}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => onStatusChange?.(request.id, "rejected")}
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Rechazar
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          variant="outline"
          size="sm"
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage + 1} de {totalPages || 1}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          variant="outline"
          size="sm"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};
