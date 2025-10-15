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
    <Card>
      <CardContent className="p-4">
       <div className="flex flex-col items-center gap-2">
  <div
    className={`flex items-center justify-center w-10 h-10 rounded-full ${
      isCheckIn ? "bg-green-100" : "bg-red-100"
    }`}
  >
    {isCheckIn ? (
      <ArrowRightCircle className="h-5 w-5 text-green-600" />
    ) : (
      <ArrowLeftCircle className="h-5 w-5 text-red-600" />
    )}
  </div>

  <Badge
    variant={isCheckIn ? "default" : "secondary"}
    className="w-20 justify-center mt-1"
  >
    {isCheckIn ? "Entrada" : "Salida"}
  </Badge>
</div>

            <div className="flex-1">
              <span className="text-sm font-medium text-foreground block">
                {new Date(record.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(record.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="text-right flex-1">
            <p className="text-sm text-muted-foreground">
              {record.description || "Registro de asistencia"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
