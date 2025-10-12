import { Clock } from "lucide-react";

export function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <Clock className="h-8 w-8 text-blue-600" />
        Control de Asistencia
      </h1>
      <p className="mt-2 text-gray-600">
        Gestiona y revisa los fichajes de los empleados
      </p>
    </div>
  );
}
