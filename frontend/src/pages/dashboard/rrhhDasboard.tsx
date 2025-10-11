import React from "react";
import { DashboardBase } from "../../components/dasboard-base";
import { Button } from "../../components/ui/button";
import { type Request } from "../../components/ui/table/RequestTable";

const mockRequests: Request[] = [
  {
    id: "1",
    type: "Corrección de fichaje",
    date: "2024-07-20",
    status: "pending",
    statusLabel: "Pendiente",
  },
  {
    id: "2",
    type: "Vacaciones",
    date: "2024-08-15 - 2024-08-22",
    status: "approved",
    statusLabel: "Aprobada",
  },
  {
    id: "3",
    type: "Ausencia médica",
    date: "2024-07-10",
    status: "rejected",
    statusLabel: "Rechazada",
  },
  {
    id: "4",
    type: "Teletrabajo",
    date: "2024-07-25",
    status: "pending",
    statusLabel: "Pendiente",
  },
];
interface RRHHRequest extends Request {
  employee: string;
}

export default function RRHDDashboard() {
  return (
    <DashboardBase userName="Admin RRHH" role="RRHH" requests={mockRequests}>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockRequests.map((req: RRHHRequest) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {req.employee}
                </td>
                <td className="px-6 py-4 text-gray-500">{req.type}</td>
                <td className="px-6 py-4 text-gray-500">{req.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                      req.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : req.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {req.statusLabel}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Rechazar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardBase>
  );
}
