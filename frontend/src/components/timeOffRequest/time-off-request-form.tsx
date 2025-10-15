import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TextArea } from "../ui/text-area";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

interface TimeOffRequestFormProps {
  formData: {
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onFormDataChange: (data: { [key: string]: string }) => void;
}

export default function TimeOffRequestForm({
  formData,
  onSubmit,
  onReset,
  onFormDataChange,
}: TimeOffRequestFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Nueva Solicitud de Permiso</CardTitle>
        <CardDescription>
          Completa el formulario para solicitar tus días libres
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de Inicio</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  handleInputChange("start_date", e.target.value)
                }
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de Fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave_type">Tipo de Permiso</Label>
            <Select
              value={formData.leave_type}
              onValueChange={(value) => handleInputChange("leave_type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de permiso" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="VACATION">Vacaciones</SelectItem>
                <SelectItem value="SICK">Permiso por Enfermedad</SelectItem>
                <SelectItem value="PERSONAL">Permiso Personal</SelectItem>
                <SelectItem value="OTHER">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo</Label>
            <TextArea
              id="reason"
              placeholder="Describe el motivo de tu solicitud..."
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onReset}>
              Cancelar
            </Button>
            <Button type="submit">Enviar Solicitud</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
