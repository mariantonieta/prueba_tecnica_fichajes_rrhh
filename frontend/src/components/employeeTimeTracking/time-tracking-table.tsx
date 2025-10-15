import { useState, useEffect } from "react";
import {
  adjustmentService,
  AdjustmentTypeEnum,
} from "../../services/adjustmentServices";
import {
  timeTrackingService,
  TimeTrackingOut,
} from "../../services/timeTrackingServices";
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TextArea } from "../ui/text-area";

export function TimeTrackingTable({
  refreshTrigger,
  userId,
  currentUserId,
  role,
}: {
  refreshTrigger?: number;
  userId: string;
  currentUserId: string;
  role: "EMPLOYEE" | "RRHH";
}) {
  const { toast } = useToast();
  const [records, setRecords] = useState<TimeTrackingOut[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  const [selectedRecord, setSelectedRecord] = useState<TimeTrackingOut | null>(
    null
  );
  const [newTimestamp, setNewTimestamp] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const totalRecords = records.length;
  const totalPages = Math.ceil(totalRecords / limit);

  const safeUserId = role === "RRHH" ? userId : currentUserId;

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const offset = currentPage * limit;

      let timeRecords: TimeTrackingOut[] = [];

      if (role === "RRHH") {
        const res = await timeTrackingService.getEmployeeRecords(userId);
        timeRecords = Array.isArray(res)
          ? res
          : res?.results || res?.data || [];
      } else {
        const paginated = await timeTrackingService.list(limit, offset);
        const list = Array.isArray(paginated)
          ? paginated
          : paginated?.results || paginated?.data || [];
        timeRecords = list.filter((r) => r.user_id === currentUserId);
      }

      let approvedAdjustments: TimeTrackingOut[] = [];

      if (role === "RRHH") {
        try {
          const adjustments = await adjustmentService.listForUser(safeUserId);
          approvedAdjustments = Array.isArray(adjustments)
            ? adjustments
                .filter((a) => a && a.status === "APPROVED")
                .map((a) => ({
                  id: a.id,
                  timestamp: a.adjusted_timestamp,
                  record_type: a.adjusted_type?.includes("ENTRY")
                    ? "CHECK_IN"
                    : "CHECK_OUT",
                  description: `${a.reason || "Sin motivo"} (ajuste aprobado)`,
                  user_id: safeUserId,
                }))
            : [];
        } catch (err) {
          console.warn(" Error obteniendo ajustes:", err);
          approvedAdjustments = [];
        }
      }

      const combinedRecords = [
        ...(Array.isArray(timeRecords) ? timeRecords : []),
        ...(Array.isArray(approvedAdjustments) ? approvedAdjustments : []),
      ].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setRecords(combinedRecords);
    } catch (error) {
      console.error(" Error fetching time records:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los registros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger, currentPage, userId, currentUserId, role]);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  const handleOpenModal = (record: TimeTrackingOut) => {
    setSelectedRecord(record);
    setNewTimestamp(record.timestamp.slice(0, 16));
    setReason("");
    setComment("");
  };

  const handleCloseModal = () => setSelectedRecord(null);

  const handleSubmit = async () => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      await adjustmentService.create({
        time_record_id: selectedRecord.id,
        adjusted_timestamp: newTimestamp,
        adjusted_type: reason as AdjustmentTypeEnum,
        reason: comment || "Sin comentarios adicionales",
      });
      toast({
        title: "Solicitud enviada",
        description: "Solicitud de corrección enviada",
      });
      handleCloseModal();
      await fetchRecords();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al enviar la solicitud",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentRecords = records.slice(
    currentPage * limit,
    (currentPage + 1) * limit
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros de Tiempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Cargando registros...
                  </TableCell>
                </TableRow>
              ) : currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hay registros disponibles
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {new Date(record.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.record_type === "CHECK_IN"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {record.record_type === "CHECK_IN"
                          ? "Entrada"
                          : "Salida"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.description || "Sin descripción"}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.description &&
                        !record.description.includes("(ajuste aprobado)") && (
                          <Button
                            onClick={() => handleOpenModal(record)}
                            variant="outline"
                            size="sm"
                          >
                            Solicitar corrección
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {Math.min(limit, currentRecords.length)} de{" "}
              {totalRecords} registros
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                Página {currentPage + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}

        <Dialog open={!!selectedRecord} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-md bg-white z-50 overflow-visible">
            <DialogHeader>
              <DialogTitle>Solicitar corrección de fichaje</DialogTitle>
              <DialogDescription>
                Fichaje original:{" "}
                <strong>
                  {selectedRecord?.record_type === "CHECK_IN"
                    ? "Entrada"
                    : "Salida"}{" "}
                  —
                  {selectedRecord &&
                    new Date(selectedRecord.timestamp).toLocaleString()}
                </strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp">Nueva fecha y hora</Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={newTimestamp}
                  onChange={(e) => setNewTimestamp(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Tipo de corrección</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo..." />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="bg-white border rounded-md shadow-lg z-50"
                  >
                    {Object.values(AdjustmentTypeEnum).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comentario adicional (opcional)</Label>
                <TextArea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Explica el motivo o detalles adicionales..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !reason}>
                {loading ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
