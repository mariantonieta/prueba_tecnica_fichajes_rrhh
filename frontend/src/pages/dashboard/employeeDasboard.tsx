import React from "react";
import { DashboardBase } from "../../components/dasboard-base";
import { type Request } from "../../components/ui/table/RequestTable";

const mockRequests: Request[] = [
  {
    id: "1",
    type: "Corrección de fichaje",
    date: "2024-07-20",
    status: "approved",
    statusLabel: "Aprobado",
  },
  {
    id: "2",
    type: "Vacaciones",
    date: "2024-08-15 - 2024-08-22",
    status: "pending",
    statusLabel: "Pendiente",
  },
  {
    id: "3",
    type: "Ausencia médica",
    date: "2024-07-10",
    status: "rejected",
    statusLabel: "Rechazado",
  },
  {
    id: "4",
    type: "Teletrabajo",
    date: "2024-07-25",
    status: "approved",
    statusLabel: "Aprobado",
  },
];

export default function EmployeeDashboard() {
  return (
    <DashboardBase userName="Elena" role="EMPLOYEE" requests={mockRequests} />
  );
}
