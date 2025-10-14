import React, { useState, useEffect } from "react"
import Header from "../../components/timeOffRequest/header"
import TimeOffRequestForm from "../../components/timeOffRequest/time-off-request-form"
import AnimatedContainer from "../../components/timeOffRequest/animated-container"
import { createTimeOffRequest, listTimeOffRequests, updateTimeOffRequest, TimeOffRequestOut } from "../../services/timeOffRequestServices"
import { useToast } from "../../hooks/use-toast"
import { RequestsTable } from "../../components/requestTable"
import { userService } from "../../services/users/userService"
import { Column } from "../../components/ui/table"

const requestColumns: Column<any>[] = [
  {
    header: "Tipo",
    accessor: "type",
  },
  {
    header: "Fecha",
    accessor: "date",
  },
  {
    header: "Estado",
    accessor: "status",
    render: (value, row) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.status === "approved" ? "bg-green-100 text-green-800" :
        row.status === "rejected" ? "bg-red-100 text-red-800" :
        "bg-yellow-100 text-yellow-800"
      }`}>
        {row.statusLabel}
      </span>
    ),
  },
  {
    header: "Motivo",
    accessor: "reason",
  },
]

export default function TimeOffRequest() {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<TimeOffRequestOut[]>([])
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    leave_type: "",
    reason: "",
  })
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userData = await userService.getCurrentUser()
        setUser(userData)

        const allRequests = await listTimeOffRequests()
        setRequests(Array.isArray(allRequests) ? allRequests : [])
      } catch (error: any) {
        console.error("Error fetching requests:", error)
        setRequests([]) 
        toast({
          title: "Error al cargar solicitudes",
          description: error.message || "No se pudieron cargar las solicitudes",
          variant: "destructive",
        })
      }
    }
    fetchRequests()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...formData }
      const response = await createTimeOffRequest(payload)
      setRequests((prev) => [...(Array.isArray(prev) ? prev : []), response])
      toast({
        title: "Solicitud enviada 🎉",
        description: `Tu solicitud de permiso desde ${formData.start_date} hasta ${formData.end_date} fue registrada.`,
        duration: 4000,
      })
      handleReset()
    } catch (error: any) {
      toast({
        title: "Error al enviar la solicitud 😢",
        description: error.response?.data?.detail || "Hubo un problema con el servidor",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ start_date: "", end_date: "", leave_type: "", reason: "" })
    setShowForm(false)
  }

  const handleFormDataChange = (updates: { [key: string]: string }) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleToggleForm = () => setShowForm(!showForm)

  const handleStatusChange = async (
  id: string,
  newStatus: "approved" | "rejected" | "pending"
) => {
  try {
    const statusForBackend = newStatus.toUpperCase() as
      | "APPROVED"
      | "REJECTED"
      | "PENDING";

    await updateTimeOffRequest(id, {
      status: statusForBackend,
      review_comment: `Revisión por ${statusForBackend}`,
    });

    setRequests((prev) =>
      (Array.isArray(prev) ? prev : []).map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      )
    );

    toast({
      title: "Solicitud actualizada",
      description: `La solicitud fue ${newStatus}`,
    });
  } catch (error: any) {
    toast({
      title: "Error al actualizar solicitud",
      description: error.message || "Intenta nuevamente",
      variant: "destructive",
    });
  }
};

  const mappedRequests = (Array.isArray(requests) ? requests : []).map((r) => ({
    id: r.id || "",
    type: r.leave_type?.replace("_", " ") || "Otro",
    date: `${r.start_date} → ${r.end_date}`,
    status: (r.status?.toLowerCase() as "approved" | "pending" | "rejected") || "pending",
    statusLabel: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Pendiente",
    user_id: r.user_id || "",
    reason: r.reason || "-",
  }))

  const hasRequests = Array.isArray(mappedRequests) && mappedRequests.length > 0

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <Header showForm={showForm} onToggleForm={handleToggleForm} />

        <AnimatedContainer show={showForm}>
          <TimeOffRequestForm
            formData={formData}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onFormDataChange={handleFormDataChange}
          />
        </AnimatedContainer>

        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          {user && hasRequests ? (
            <RequestsTable
              requests={mappedRequests}
              role={user.role}
              currentUserId={user.id}
              columns={requestColumns}
              onStatusChange={user.role === "RRHH" ? handleStatusChange : undefined}
            />
          ) : (
            <div className="text-center p-4 text-gray-500">
              {user ? "No hay solicitudes" : "Cargando..."}
            </div>
          )}
        </div>

        {!showForm && !hasRequests && user && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay solicitudes de permiso
            </h3>
            <p className="text-gray-500">
              Presiona "Nueva Solicitud" para comenzar.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center text-sm text-muted-foreground">
            Enviando solicitud...
          </div>
        )}
      </div>
    </div>
  )
}