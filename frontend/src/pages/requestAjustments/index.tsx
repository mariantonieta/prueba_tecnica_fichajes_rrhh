import React, { useState, useEffect } from "react";
import { RequestsTable, Request } from "../../components/requestTable";
import {
  adjustmentService,
  AdjustmentStatusEnum,
} from "../../services/adjustmentServices";
import { userService } from "../../services/users/userService";
import { useToast } from "../../hooks/use-toast";
import { Loader } from "../../components/ui/loader";
import { UserOut } from "../../services/users/userTypes";

export default function RequestAdjustments() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserOut | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);

        const allAdjustments = await adjustmentService.getAll();
        const mappedRequests: Request[] = allAdjustments.map((adj: any) => ({
          id: adj.id,
          type: adj.adjusted_type?.replace("_", " ") || "Ajuste",
          date: new Date(adj.adjusted_timestamp).toLocaleString(),
          status: adj.status.toLowerCase() as
            | "approved"
            | "pending"
            | "rejected",
          statusLabel: adj.status?.replace("_", " ") || "Pendiente",
          userId: adj.user_id,
        }));
        setRequests(mappedRequests);
      } catch (error: any) {
        console.error("Error cargando datos:", error);
        toast({
          title: "Error al cargar solicitudes",
          description:
            error.message || "No se pudieron cargar las solicitudes de ajuste.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: AdjustmentStatusEnum
  ) => {
    try {
      await adjustmentService.updateStatus(
        id,
        newStatus,
        `Revisión por ${newStatus}`
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req,
                status: newStatus.toLowerCase() as
                  | "approved"
                  | "pending"
                  | "rejected",
                statusLabel: newStatus.replace("_", " "),
              }
            : req
        )
      );

      toast({
        title: "Solicitud actualizada",
        description: `La solicitud fue ${newStatus.toLowerCase()}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error actualizando solicitud:", error);
      toast({
        title: "Error al actualizar solicitud",
        description: error.message || "Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-2">
        <Loader size="lg" />
        <span className="text-gray-500">Cargando solicitudes...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center text-red-600">
        No se pudo cargar la información del usuario
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitudes de Ajuste
          </h1>
          <p className="mt-2 text-gray-600">
            {user.role === "RRHH"
              ? "Gestiona todas las solicitudes de ajuste de horarios"
              : "Mis solicitudes de ajuste de horarios"}
          </p>
        </div>

        {user.role === "RRHH" && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Total de Solicitudes",
                value: requests.length,
                color: "blue",
              },
              {
                label: "Pendientes",
                value: requests.filter((r) => r.status === "pending").length,
                color: "yellow",
              },
              {
                label: "Resueltas",
                value: requests.filter((r) => r.status !== "pending").length,
                color: "green",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-white p-4 rounded-lg shadow border hover:shadow-lg transition`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {stat.label}
                </h3>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <RequestsTable
            requests={requests}
            role={user.role}
            currentUserId={user.id}
            onStatusChange={
              user.role === "RRHH" ? handleStatusChange : undefined
            }
          />
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay solicitudes de ajuste
            </h3>
            <p className="text-gray-500">
              {user.role === "RRHH"
                ? "No hay solicitudes de ajuste pendientes o aprobadas en el sistema."
                : "No has realizado ninguna solicitud de ajuste."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
