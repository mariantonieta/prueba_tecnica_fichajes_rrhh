import { Clock } from "lucide-react";

export function Header() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 shrink-0">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Control de Asistencia
            </h1>
            <p className="text-muted-foreground">
              Gestiona y revisa los fichajes de los empleados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
