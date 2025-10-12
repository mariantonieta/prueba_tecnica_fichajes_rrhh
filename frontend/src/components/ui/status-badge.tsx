import React from "react";

export type StatusType = "approved" | "pending" | "rejected";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles: Record<StatusType, string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${styles[status]}`}
    >
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
