import React from "react";
import { Search, User } from "lucide-react";
import { UserOut } from "../../services/users/userTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Empleados ({employees.length})
        </CardTitle>
        <CardDescription>
          Selecciona un empleado para ver su historial
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
  return (
    <div
      className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-blue-200" : "border-gray-100"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {employee.full_name || employee.username}
          </p>
          <p className="text-sm text-gray-500 truncate">{employee.email}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyEmployeeState() {
  return (
    <div className="text-center py-8 text-gray-500">
      <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
      <p>No se encontraron empleados</p>
    </div>
  );
}
