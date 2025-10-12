import React, { useState, useEffect } from "react";
import {
  adjustmentService,
  AdjustmentTypeEnum,
} from "../../services/adjustmentServices";
import { timeTrackingService } from "../../services/timeTrackingServices";
import { useToast } from "../..//hooks/use-toast";

export interface TimeRecord {
  id: string;
  timestamp: string;
  record_type: "CHECK_IN" | "CHECK_OUT";
  description: string;
}

export function TimeTrackingTable({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const { toast } = useToast();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);
  const [newTimestamp, setNewTimestamp] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger]);

  const fetchRecords = async () => {
    try {
      const data = await timeTrackingService.list();
      setRecords(
        data.map((r: any) => ({
          id: r.id,
          timestamp: r.timestamp,
          record_type: r.record_type,
          description: r.description,
        }))
      );
    } catch (error) {
      console.error("Error fetching time records:", error);
    }
  };

  const handleOpenModal = (record: TimeRecord) => {
    setSelectedRecord(record);
    setNewTimestamp(record.timestamp.slice(0, 16));
    setReason("");
    setComment("");
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

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
        variant: "default",
      });
      handleCloseModal();

      await fetchRecords();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: " Error al enviar la solicitud",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3">Fecha y Hora</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2">
                {new Date(record.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {record.record_type === "CHECK_IN" ? "Entrada" : "Salida"}
              </td>
              <td className="px-4 py-2">{record.description}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => handleOpenModal(record)}
                  className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                >
                  Solicitar corrección
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Solicitar corrección de fichaje
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Fichaje original:{" "}
              <strong>
                {selectedRecord.record_type === "CHECK_IN"
                  ? "Entrada"
                  : "Salida"}{" "}
                — {new Date(selectedRecord.timestamp).toLocaleString()}
              </strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nueva fecha y hora
                </label>
                <input
                  type="datetime-local"
                  value={newTimestamp}
                  onChange={(e) => setNewTimestamp(e.target.value)}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de corrección
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecciona un tipo...</option>
                  {Object.values(AdjustmentTypeEnum).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comentario adicional (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Explica el motivo o detalles adicionales..."
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-5">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !reason}
                className={`px-4 py-2 rounded-md text-white ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
