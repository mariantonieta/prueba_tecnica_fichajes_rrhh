import { UserOut } from "../../services/users/userTypes";

interface PanelHeaderProps {
  selectedEmployee: UserOut | null;
  onClearSelection: () => void;
}

export function PanelHeader({
  selectedEmployee,
  onClearSelection,
}: PanelHeaderProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex items-start gap-5">
        <div className="min-w-0 flex-1">
          {selectedEmployee ? (
            <>
              <h3 className="text-xl font-semibold truncate">
                Historial de{" "}
                {selectedEmployee.full_name || selectedEmployee.username}
              </h3>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {selectedEmployee.email}
              </p>
            </>
          ) : (
            <h3 className="text-xl font-semibold">Selecciona un empleado</h3>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <p className="text-sm text-muted-foreground mt-1">
          Registros de fichaje
        </p>
      )}
    </div>
  );
}
