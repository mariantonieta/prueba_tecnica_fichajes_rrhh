import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { RecordsList } from "./record-list";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";

interface PanelContentProps {
  selectedEmployee: any;
  recordsLoading: boolean;
  paginatedRecords: {
    total: number;
    count: number;
    limit: number;
    offset: number;
    results: TimeTrackingOut[];
  };
  onPageChange: (newOffset: number) => void;
}

export function PanelContent({
  selectedEmployee,
  recordsLoading,
  paginatedRecords,
  onPageChange,
}: PanelContentProps) {
  if (!selectedEmployee) {
    return (
      <Card className="h-64 flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Selecciona un empleado para ver su historial
          </p>
        </CardContent>
      </Card>
    );
  }

  if (recordsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando registros...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <RecordsList data={paginatedRecords} onPageChange={onPageChange} />;
}
