import React from "react";
import { Clock } from "lucide-react";
import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { Badge } from "../ui/badge";

interface TimeRecordItemProps {
  record: TimeTrackingOut;
}

export function TimeRecordItem({ record }: TimeRecordItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center ${
          record.record_type === "CHECK_IN"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        <Clock className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">
          {record.record_type === "CHECK_IN" ? "Check-In" : "Check-Out"}
        </p>
        <p className="text-sm text-gray-500">{formatDate(record.timestamp)}</p>
        {record.description && (
          <p className="text-sm text-gray-600 mt-1">{record.description}</p>
        )}
      </div>
      <div className="text-right">
        <Badge
          variant={
            record.record_type === "CHECK_IN" ? "default" : "destructive"
          }
        >
          {record.record_type === "CHECK_IN" ? "Entrada" : "Salida"}
        </Badge>
        <p className="text-sm font-medium text-gray-900 mt-1">
          {formatTime(record.timestamp)}
        </p>
      </div>
    </div>
  );
}
