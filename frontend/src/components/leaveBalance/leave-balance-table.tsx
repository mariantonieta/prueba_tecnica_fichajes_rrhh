import React, { useState, useMemo } from "react";
import { LeaveBalance } from "../../services/leaveBalanceServices/leaveBalanceTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Progress } from "../ui/progress";

interface LeaveBalanceTableProps {
  balances: LeaveBalance[];
  isRRHH?: boolean;
  pageSize?: number;
}

export const LeaveBalanceTable: React.FC<LeaveBalanceTableProps> = ({
  balances,
  isRRHH = false,
  pageSize = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(balances.length / pageSize);

  const paginatedBalances = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return balances.slice(startIndex, startIndex + pageSize);
  }, [balances, currentPage, pageSize]);

  if (!Array.isArray(balances) || balances.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron registros
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {isRRHH && <TableHead className="font-bold">Empleado</TableHead>}
            <TableHead className="font-bold">Tipo</TableHead>
            <TableHead className="font-bold text-center">Total</TableHead>
            <TableHead className="font-bold text-center">Usados</TableHead>
            <TableHead className="font-bold text-center">Restantes</TableHead>
            <TableHead className="font-bold text-center">Año</TableHead>
            <TableHead className="font-bold text-center">Progreso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBalances.map((balance) => {
            const isSickLeave =
              balance.leave_type === "SICK" ||
              balance.leave_type === "ENFERMEDAD";
            const usedPercentage = isSickLeave
              ? 0
              : balance.total_days > 0
              ? (balance.used_days / balance.total_days) * 100
              : 0;

            const variant = isSickLeave
              ? "default"
              : usedPercentage > 75
              ? "destructive"
              : usedPercentage > 50
              ? "warning"
              : "success";

            const leaveTypeDisplay =
              balance.leave_type === "VACATION"
                ? "Vacaciones"
                : balance.leave_type === "SICK"
                ? "Enfermedad"
                : balance.leave_type;

            return (
              <TableRow key={balance.id} className="hover:bg-gray-50 border-b">
                {isRRHH && (
                  <TableCell className="font-medium py-4">
                    {balance.user_name}
                  </TableCell>
                )}
                <TableCell className="font-medium py-4">
                  {leaveTypeDisplay}
                </TableCell>
                <TableCell className="text-center py-4">
                  {balance.total_days.toFixed(2)}
                </TableCell>
                <TableCell className="text-center py-4">
                  {balance.used_days.toFixed(2)}
                </TableCell>
                <TableCell className="text-center font-bold text-blue-700 py-4">
                  {balance.remaining_days.toFixed(2)}
                </TableCell>
                <TableCell className="text-center py-4">
                  {balance.year}
                </TableCell>
                <TableCell className="py-4">
                  {isSickLeave ? (
                    <div className="text-center text-sm text-gray-500">
                      No aplica
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 max-w-[150px] mx-auto">
                      <Progress
                        value={usedPercentage}
                        variant={variant}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-600 w-10">
                        {Math.round(usedPercentage)}%
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
