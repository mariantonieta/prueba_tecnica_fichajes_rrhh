import React, { useState, useEffect } from "react";
import { DashboardBase } from "../../components/dashboard";
import { Button } from "../../components/ui/button";
import {
  requestService,
  RequestOut,
} from "../../services/requestServices/index";
import { userService } from "../../services/users/userService";
import { useToast } from "../../hooks/use-toast";
import { Loader } from "../../components/ui/loader";
import { UserOut } from "../../services/users/userTypes";

export default function RRHDDashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserOut | null>(null);
  const [requests, setRequests] = useState<RequestOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
      } catch (error: any) {
        toast({
          title: "Error al cargar usuario",
          description: error.message || "No se pudo obtener el usuario actual.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestService.list();
        setRequests(data);
      } catch (error: any) {
        console.error("Error al cargar solicitudes:", error.message);
        toast({
          title: "Error al cargar solicitudes",
          description: "No se pudieron cargar las solicitudes de ajuste.",
          variant: "destructive",
        });
      } finally {
        setRequestsLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      await requestService.approve(id);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "approved", statusLabel: "Aprobado" }
            : r
        )
      );
      toast({
        title: "Solicitud aprobada",
        description: "La solicitud ha sido aprobada correctamente.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error al aprobar:", error.message);
      toast({
        title: "Error al aprobar",
        description: error.message || "No se pudo aprobar la solicitud.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await requestService.reject(id);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "rejected", statusLabel: "Rechazada" }
            : r
        )
      );
      toast({
        title: "Solicitud rechazada",
        description: "La solicitud ha sido rechazada correctamente.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error al rechazar:", error.message);
      toast({
        title: "Error al rechazar",
        description: error.message || "No se pudo rechazar la solicitud.",
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <Loader /> Cargando dashboard...
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        No se pudo cargar el usuario
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardBase
        userName={user.full_name || user.username}
        role="RRHH"
        userId={user.id}
        currentUserId={user.id}
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Gestión de Solicitudes de Ajuste
        </h2>

        {requestsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader /> Cargando solicitudes...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => {
                  const isOwnRequest = req.userId === user.id;

                  return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {req.employee}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{req.type}</td>
                      <td className="px-6 py-4 text-gray-500">{req.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                            req.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : req.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {req.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        {req.status === "pending" && !isOwnRequest ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(req.id)}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleReject(req.id)}
                            >
                              Rechazar
                            </Button>
                          </>
                        ) : req.status === "pending" && isOwnRequest ? (
                          <span className="text-gray-400 italic">
                            No puedes revisar tu propia solicitud
                          </span>
                        ) : (
                          <span>--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay solicitudes de ajuste pendientes.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
