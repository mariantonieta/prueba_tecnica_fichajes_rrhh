import React from "react";

type StatusType = "approved" | "pending" | "rejected";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusStyles: Record<StatusType, string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}
