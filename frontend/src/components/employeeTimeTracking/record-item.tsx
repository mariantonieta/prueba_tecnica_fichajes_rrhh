import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ArrowRightCircle, ArrowLeftCircle } from "lucide-react";

interface RecordItemProps {
  record: TimeTrackingOut;
}

export function RecordItem({ record }: RecordItemProps) {
  const isCheckIn = record.record_type === "CHECK_IN";

  return (
    <Card className="mb-3 shadow-sm">
      <CardContent className="px-4 py-6 flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            isCheckIn ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isCheckIn ? (
            <ArrowRightCircle className="h-6 w-6 text-green-600" />
          ) : (
            <ArrowLeftCircle className="h-6 w-6 text-red-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={isCheckIn ? "default" : "secondary"}>
              {isCheckIn ? "Entrada" : "Salida"}
            </Badge>
            <span className="text-sm font-medium text-foreground">
              {new Date(record.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {record.description || "Registro de asistencia"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
