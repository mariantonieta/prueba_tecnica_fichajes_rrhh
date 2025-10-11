import React, { ReactNode, useState } from "react";
import { Fingerprint } from "lucide-react";
import { Button } from "./ui/button";
import { StatsCard } from "./ui/card/StatsCard";
import { RequestsTable, type Request } from "./ui/table/RequestTable";
import { useToast } from "../hooks/use-toast";

interface DashboardBaseProps {
  userName: string;
  userInitials?: string;
  role: "EMPLOYEE" | "RRHH";
  requests: Request[];
  children?: ReactNode;
}

export function DashboardBase({
  userName,
  userInitials = userName[0],
  role,
  requests,
  children,
}: DashboardBaseProps) {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const { toast } = useToast();

  const handleClock = () => {
    const now = new Date();
    setTimestamps([...timestamps, now.toLocaleString()]);

    toast({
      title: "Fichaje registrado",
      description: `Hora registrada: ${now.toLocaleTimeString()}`,
      variant: "default",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 mx-auto max-w-7xl px-6 py-8 space-y-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido/a, {userName}
        </h1>

        <Button
          size="lg"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={handleClock}
        >
          <Fingerprint className="h-5 w-5" />
          Fichar Entrada/Salida
        </Button>
      </div>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Resumen de Horas
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <StatsCard
            label="Horas trabajadas (Semana)"
            value="32h"
            maxValue="40h"
          />
          <StatsCard
            label="Horas trabajadas (Mes)"
            value="128h"
            maxValue="160h"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Solicitudes Recientes
        </h2>
        <RequestsTable requests={requests} />
      </section>

      {role === "RRHH" && children && <section>{children}</section>}

      {role === "EMPLOYEE" && timestamps.length > 0 && (
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Fichajes Registrados
          </h3>
          <ul className="list-disc list-inside text-gray-700">
            {timestamps.map((time, idx) => (
              <li key={idx}>{time}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
