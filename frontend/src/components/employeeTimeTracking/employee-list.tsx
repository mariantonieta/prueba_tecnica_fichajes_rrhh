import { PlusCircle, Search, User } from "lucide-react";
import { UserOut } from "../../services/users/userTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { UserAvatar } from "../ui/avatar";
import { RegisterUserModal } from "../auth/register-user-modal";
import { Button } from "../ui/button";

interface EmployeeListProps {
  employees: UserOut[];
  selectedEmployee: UserOut | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEmployeeSelect: (employee: UserOut) => void;
}

export function EmployeeList({
  employees,
  selectedEmployee,
  searchQuery,
  onSearchChange,
  onEmployeeSelect,
}: EmployeeListProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex justify-end">
          <RegisterUserModal>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <PlusCircle className="w-4 h-4" />
              Nuevo
            </Button>
          </RegisterUserModal>
        </div>

        {/* Título y badge */}
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            Empleados
          </CardTitle>

          <Badge variant="secondary" className="text-sm">
            {employees.length}
          </Badge>
        </div>

        <CardDescription>
          Selecciona un empleado para ver su historial
        </CardDescription>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empleados..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {employees.length === 0 ? (
            <EmptyEmployeeState />
          ) : (
            employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                isSelected={selectedEmployee?.id === employee.id}
                onSelect={() => onEmployeeSelect(employee)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface EmployeeCardProps {
  employee: UserOut;
  isSelected: boolean;
  onSelect: () => void;
}

function EmployeeCard({ employee, isSelected, onSelect }: EmployeeCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`p-4 border-b cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-primary/10 border-primary/20"
          : "border-border hover:bg-accent"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <UserAvatar
          src={employee.avatar}
          alt={employee.full_name || employee.username}
          fallback={getInitials(employee.full_name || employee.username)}
        />

        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-medium text-sm truncate">
            {employee.full_name || employee.username}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {employee.email}
          </p>
        </div>

        {isSelected && (
          <Badge variant="default" className="text-xs">
            Seleccionado
          </Badge>
        )}
      </div>
    </div>
  );
}

function EmptyEmployeeState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <p className="font-medium">No se encontraron empleados</p>
      <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
    </div>
  );
}
