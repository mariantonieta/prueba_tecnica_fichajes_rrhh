import React from "react";
import { StatusBadge } from "./StatusBadget";

export interface Request {
  id: string;
  type: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  statusLabel: string;
}

interface RequestsTableProps {
  requests: Request[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              TIPO
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              FECHA
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              ESTADO
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {request.type}
              </td>
              <td className="px-6 py-4 text-gray-500">{request.date}</td>
              <td className="px-6 py-4">
                <StatusBadge
                  status={request.status}
                  label={request.statusLabel}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
