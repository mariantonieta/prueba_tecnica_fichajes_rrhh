import React, { useState, useEffect } from "react";
import { RequestsTable } from "../../components/requestTable";
import {
  adjustmentService,
  AdjustmentStatusEnum,
} from "../../services/adjustmentServices";
import { userService } from "../../services/users/userService";
import { useToast } from "../../hooks/use-toast";
import { Loader } from "../../components/ui/loader";
import { UserOut } from "../../services/users/userTypes";
import { Column } from "../../components/ui/table";
import { ReviewModal } from "../../components/modal-comment";

interface Request {
  id: string;
  type: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  statusLabel: string;
  userId: string;
  user_id?: string;
  full_name: string;
  review_comment: string;
}

const adjustmentColumns: Column<Request>[] = [
  { header: "Tipo", accessor: "type" },
  { header: "Fecha", accessor: "date" },
  {
    header: "Estado",
    accessor: "status",
    render: (value, row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.status === "approved"
            ? "bg-green-100 text-green-800"
            : row.status === "rejected"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.statusLabel}
      </span>
    ),
  },
];

export default function RequestAdjustments() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserOut | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request: Request, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirm = (status: "approved" | "rejected", comment?: string) => {
    if (selectedRequest) {
      handleStatusChange(selectedRequest.id, status, comment);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);

        const allAdjustments = await adjustmentService.getAll();
        const safeAdjustments = Array.isArray(allAdjustments)
          ? allAdjustments
          : [];

        const mappedRequests: Request[] = safeAdjustments.map((adj: any) => ({
          id: adj.id || "",
          type: adj.adjusted_type?.replace("_", " ") || "Ajuste",
          date: adj.adjusted_timestamp
            ? new Date(adj.adjusted_timestamp).toLocaleString()
            : "Fecha no disponible",
          status:
            (adj.status?.toLowerCase() as
              | "approved"
              | "pending"
              | "rejected") || "pending",
          statusLabel: adj.status?.replace("_", " ") || "Pendiente",
          userId: adj.user_id || "",
          user_id: adj.user_id || "",
          full_name: adj.full_name || "Desconocido",
          review_comment: adj.review_comment,
        }));

        setRequests(mappedRequests);
      } catch (error: any) {
        console.error("Error cargando datos:", error);
        setRequests([]);
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
    newStatus: AdjustmentStatusEnum,
    comment?: string
  ) => {
    try {
      const finalComment =
        comment?.trim() || `Revisión por ${newStatus.toUpperCase()}`;

      await adjustmentService.updateStatus(
        id,
        newStatus.toUpperCase() as AdjustmentStatusEnum,
        finalComment
      );

      setRequests((prev) =>
        (Array.isArray(prev) ? prev : []).map((req) =>
          req.id === id
            ? {
                ...req,
                status: newStatus.toLowerCase() as
                  | "approved"
                  | "pending"
                  | "rejected",
                statusLabel: newStatus.replace("_", " "),
                review_comment: finalComment,
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

  const safeRequests = Array.isArray(requests) ? requests : [];
  const hasRequests = safeRequests.length > 0;

  const totalRequests = safeRequests.length;
  const pendingRequests = safeRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const resolvedRequests = safeRequests.filter(
    (r) => r.status !== "pending"
  ).length;

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
                value: totalRequests,
                color: "blue",
              },
              { label: "Pendientes", value: pendingRequests, color: "yellow" },
              { label: "Resueltas", value: resolvedRequests, color: "green" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-4 rounded-lg shadow border hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {stat.label}
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "yellow"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          {hasRequests ? (
            <RequestsTable
              requests={safeRequests}
              role={user.role}
              currentUserId={user.id}
              columns={adjustmentColumns}
              onStatusChange={
                user.role === "RRHH"
                  ? (id, status) => {
                      const req = safeRequests.find((r) => r.id === id);
                      if (!req) return;
                      if (status === "approved") openModal(req, "approve");
                      else if (status === "rejected") openModal(req, "reject");
                    }
                  : undefined
              }
            />
          ) : (
            <div className="text-center p-4 text-gray-500">
              No hay solicitudes de ajuste disponibles
            </div>
          )}
        </div>

        {selectedRequest && modalAction && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirm}
            request={selectedRequest}
            action={modalAction}
          />
        )}

        {!hasRequests && (
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
