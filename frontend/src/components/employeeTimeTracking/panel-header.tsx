import { ArrowLeft } from "lucide-react";
import { UserOut } from "../../services/users/userTypes";

interface PanelHeaderProps {
  selectedEmployee: UserOut | null;
  onClearSelection: () => void;
}

export function PanelHeader({ selectedEmployee, onClearSelection }: PanelHeaderProps) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold">
        {selectedEmployee ? (
          <>
            <button
              onClick={onClearSelection}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Volver a la lista de empleados"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            Historial de {selectedEmployee.full_name || selectedEmployee.username}
          </>
        ) : (
          "Selecciona un empleado"
        )}
      </h3>
      {selectedEmployee && (
        <p className="text-gray-500 text-sm">
          Registros de fichaje - {selectedEmployee.email}
        </p>
      )}
    </div>
  );
}