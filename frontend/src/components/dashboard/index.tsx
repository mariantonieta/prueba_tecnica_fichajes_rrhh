import { useState, useEffect, ReactNode } from "react";
import { Fingerprint } from "lucide-react";
import { Button } from "../ui/button";
import { StatsCard } from "./stats-card";
import { TimeTrackingTable } from "../employeeTimeTracking/time-tracking-table";
import { useToast } from "../../hooks/use-toast";
import { timeTrackingService } from "../../services/timeTrackingServices";

export interface DashboardBaseProps {
  userName: string;
  userInitials?: string;
  role: "EMPLOYEE" | "RRHH";
  userId: string;
  currentUserId: string;
  children?: ReactNode;
}

export function DashboardBase({
  userName,
  userId,
  currentUserId,
  role,
  children,
}: DashboardBaseProps) {
  const { toast } = useToast();

  const [timestamps, setTimestamps] = useState<TimeRecord[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [weeklyLimit, setWeeklyLimit] = useState(40);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(160);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getNextRecordType = (): "CHECK_IN" | "CHECK_OUT" =>
    timestamps.length % 2 === 0 ? "CHECK_IN" : "CHECK_OUT";

  const getNextActionLabel = (): string =>
    getNextRecordType() === "CHECK_IN" ? "Check In" : "Check Out";

  const getMondayOfWeek = (date: Date): Date => {
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + 1);
    return new Date(
      Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate())
    );
  };

  const fetchWeeklyHours = async () => {
    const mondayUTC = getMondayOfWeek(new Date());
    const mondayDate = mondayUTC.toISOString().split("T")[0];
    const weekly = await timeTrackingService.getWeeklyHours(mondayDate);
    setWeeklyHours(weekly.hours_worked);
    setWeeklyLimit(weekly.weekly_limit);
  };

  const fetchMonthlyHours = async () => {
    const today = new Date();
    const monthly = await timeTrackingService.getMonthlyHours(
      today.getFullYear(),
      today.getMonth() + 1
    );
    setMonthlyHours(monthly.hours_worked);
    setMonthlyLimit(monthly.monthly_limit);
  };

  const fetchUserRecords = async () => {
    const allRecords = await timeTrackingService.list(100, 0);
    const safeUserId = role === "RRHH" ? userId : currentUserId;

    setTimestamps(
      allRecords.results
        .filter((r) => r.user_id === safeUserId)
        .map((r) => ({
          id: r.id,
          timestamp: r.timestamp,
          record_type: r.record_type,
          description: r.description || "",
        }))
    );
  };

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchWeeklyHours(),
        fetchMonthlyHours(),
        fetchUserRecords(),
      ]);
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, currentUserId, role, refreshTrigger]);

  const handleClock = async () => {
    try {
      const recordType = getNextRecordType();
      const now = new Date();
      await timeTrackingService.create({
        record_type: recordType,
        description: `Fichaje ${
          recordType === "CHECK_IN" ? "de entrada" : "de salida"
        } a las ${now.toLocaleTimeString()}`,
      });
      toast({
        title: "Fichaje registrado",
        description: `Tipo: ${recordType} - Hora: ${now.toLocaleTimeString()}`,
        variant: "default",
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast({
        title: "Error al registrar fichaje",
        description: error.message || "Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bienvenido/a, {userName}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {role === "RRHH"
              ? "Panel de Recursos Humanos"
              : "Panel de Empleado"}
          </p>
        </div>

        <Button
          size="lg"
          className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white ${
            getNextRecordType() === "CHECK_IN"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={handleClock}
        >
          <Fingerprint className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">{getNextActionLabel()}</span>
        </Button>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Resumen de Horas
          </h2>
          <p className="text-sm text-muted-foreground">
            Seguimiento de horas trabajadas
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          <StatsCard
            label="Horas trabajadas (Semana)"
            value={`${weeklyHours.toFixed(1)}h`}
            maxValue={`${weeklyLimit}h`}
          />
          <StatsCard
            label="Horas trabajadas (Mes)"
            value={`${monthlyHours.toFixed(1)}h`}
            maxValue={`${monthlyLimit}h`}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
            Fichajes Registrados
          </h3>
          <p className="text-sm text-muted-foreground">
            Historial de registros de tiempo
          </p>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <TimeTrackingTable
            refreshTrigger={refreshTrigger}
            userId={userId}
            currentUserId={currentUserId}
            role={role}
          />
        </div>
      </section>

      {children && <section className="space-y-4">{children}</section>}
    </main>
  );
}
