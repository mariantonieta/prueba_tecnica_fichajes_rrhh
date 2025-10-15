import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../hooks/use-toast";
import { userService } from "../../services/users/userService";
import {
  createTimeOffRequest,
  listTimeOffRequests,
  TimeOffRequestOut,
  updateTimeOffRequest,
} from "../../services/timeOffRequestServices";
import Header from "../../components/timeOffRequest/header";
import TimeOffRequestForm from "../../components/timeOffRequest/time-off-request-form";
import AnimatedContainer from "../../components/timeOffRequest/animated-container";
import { RequestsTable } from "../../components/requestTable";
import { ReviewModal } from "../../components/modal-comment";
import { Skeleton } from "../../components/ui/skeleton";

export default function TimeOffRequest() {
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<TimeOffRequestOut[]>([]);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    leave_type: "",
    reason: "",
  });

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    const req = requests.find((r) => r.id === id);
    if (!req) return;

    const action: "approve" | "reject" =
      status === "approved" ? "approve" : "reject";

    const requestForModal = {
      id: req.id,
      full_name: req.full_name || "",
      type: req.leave_type?.replace("_", " ") || "Otro",
      date: `${req.start_date} → ${req.end_date}`,
      status:
        (req.status?.toLowerCase() as "approved" | "pending" | "rejected") ||
        "pending",
      statusLabel:
        req.status === "approved"
          ? "Aprobado"
          : req.status === "rejected"
          ? "Rechazado"
          : "Pendiente",
      review_comment: req.review_comment || "",
    };

    openModal(requestForModal, action);
  };

  const handleConfirm = async (
    status: "approved" | "rejected",
    comment?: string
  ) => {
    if (!selectedRequest) return;

    const newStatus = status.toUpperCase() as "APPROVED" | "REJECTED";
    const finalComment =
      comment?.trim() ||
      (status === "approved" ? "Solicitud aprobada" : "Solicitud rechazada");

    setIsModalOpen(false);

    try {
      const updated = await updateTimeOffRequest(selectedRequest.id, {
        status: newStatus,
        review_comment: finalComment,
      });

      setRequests((prev) =>
        prev.map((req) => (req.id === selectedRequest.id ? updated : req))
      );

      toast({
        title: "Solicitud actualizada",
        description: `La solicitud fue ${
          status === "approved" ? "aprobada" : "rechazada"
        }`,
        variant: status === "rejected" ? "destructive" : "default",
      });
    } catch (error: any) {
      console.error("Error updating request:", error);

      if (error.response?.status === 400) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id
              ? {
                  ...req,
                  status: "REJECTED",
                  review_comment: "No tienes días disponibles suficientes.",
                }
              : req
          )
        );
        toast({
          title: "Solicitud rechazada",
          description: "No tienes días disponibles suficientes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            error.response?.data?.detail ||
            "Ocurrió un error al actualizar la solicitud.",
          variant: "destructive",
        });
      }
    }
  };
  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        setLoadingUser(true);
        const userData = await userService.getCurrentUser();
        setUser(userData);

        const allRequests = await listTimeOffRequests();
        setRequests(Array.isArray(allRequests) ? allRequests : []);
      } catch (error: any) {
        toast({
          title: "Error al cargar solicitudes",
          description: error.message || "No se pudieron cargar las solicitudes",
          variant: "destructive",
        });
        setRequests([]);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserAndRequests();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const response = await createTimeOffRequest({ ...formData });
      setRequests((prev) => [...(Array.isArray(prev) ? prev : []), response]);
      toast({
        title: "Solicitud enviada 🎉",
        description: `Tu solicitud de permiso desde ${formData.start_date} hasta ${formData.end_date} fue registrada.`,
      });
      handleReset();
    } catch (error: any) {
      toast({
        title: "Error al enviar la solicitud 😢",
        description:
          error.response?.data?.detail || "Hubo un problema con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleReset = () =>
    setFormData({ start_date: "", end_date: "", leave_type: "", reason: "" });

  const handleFormDataChange = (updates: { [key: string]: string }) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const handleToggleForm = () => setShowForm((prev) => !prev);

  const mappedRequests = useMemo(() => {
    return (Array.isArray(requests) ? requests : []).map((r) => {
      const status = r.status?.toLowerCase() as
        | "approved"
        | "pending"
        | "rejected"
        | undefined;

      return {
        id: r.id || "",
        type: r.leave_type?.replace("_", " ") || "Otro",
        date: `${r.start_date} → ${r.end_date}`,
        status: status || "pending",
        statusLabel:
          status === "approved"
            ? "Aprobado"
            : status === "rejected"
            ? "Rechazado"
            : "Pendiente",
        user_id: r.user_id || "",
        full_name: r.full_name || "",
        reason: r.reason || "-",
        review_comment: r.review_comment || "",
      };
    });
  }, [requests]);

  const hasRequests = mappedRequests.length > 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <Header showForm={showForm} onToggleForm={handleToggleForm} />
        <AnimatedContainer show={showForm}>
          <TimeOffRequestForm
            formData={formData}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onFormDataChange={handleFormDataChange}
            loading={loadingSubmit}
          />
        </AnimatedContainer>

        <div className="overflow-x-auto bg-white rounded-lg shadow border min-h-[200px]">
          {loadingUser ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : user && hasRequests ? (
            <>
              <RequestsTable
                requests={mappedRequests}
                role={user.role}
                currentUserId={user.id}
                onStatusChange={
                  user.role === "RRHH" ? handleStatusChange : undefined
                }
                pageSize={5}
              />
              {selectedRequest && modalAction && (
                <ReviewModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onConfirm={handleConfirm}
                  request={selectedRequest}
                  action={modalAction}
                />
              )}
            </>
          ) : (
            <div className="text-center p-8 text-gray-500">
              {user ? "No hay solicitudes para mostrar" : "Cargando..."}
            </div>
          )}
        </div>

        {loadingSubmit && (
          <div className="text-center text-sm text-muted-foreground">
            Enviando solicitud...
          </div>
        )}
      </div>
    </div>
  );
}
