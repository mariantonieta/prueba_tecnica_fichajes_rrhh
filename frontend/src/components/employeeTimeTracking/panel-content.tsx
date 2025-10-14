import { Clock, Calendar } from "lucide-react";
import { UserOut } from "../../services/users/userTypes";
import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { RecordsList } from "./record-list";
import { LoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";

interface PanelContentProps {
  selectedEmployee: UserOut | null;
  recordsLoading: boolean;
  filteredRecords: TimeTrackingOut[];
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
}

export function PanelContent({
  selectedEmployee,
  recordsLoading,
  filteredRecords,
  filterType,
}: PanelContentProps) {
  if (!selectedEmployee) {
    return (
      <EmptyState
        icon={Clock}
        title="Sin empleado seleccionado"
        description="Selecciona un empleado de la lista para ver su historial de fichajes"
      />
    );
  }

  if (recordsLoading) {
    return <LoadingState />;
  }

  if (filteredRecords.length === 0) {
    const getEmptyMessage = () => {
      if (filterType === "all") {
        return "Este empleado no tiene fichajes registrados";
      }
      return `No hay fichajes de ${filterType === "CHECK_IN" ? "entrada" : "salida"}`;
    };

    return (
      <EmptyState
        icon={Calendar}
        title="No hay registros"
        description={getEmptyMessage()}
      />
    );
  }

  return <RecordsList records={filteredRecords} />;
}