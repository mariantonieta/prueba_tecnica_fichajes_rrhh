import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import type { UserOut, UserUpdate } from "../../services/users/userTypes";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { UserAvatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

const schema = z.object({
  full_name: z.string().min(2, "El nombre completo es obligatorio"),
  username: z.string().min(3, "El username es obligatorio"),
  email: z.string().email("Correo inválido"),
  initial_vacation_days: z
    .string()
    .regex(/^\d*\.?\d*$/, "Solo se permiten números o decimales")
    .optional(),
  initial_weekly_hours: z
    .string()
    .regex(/^\d*\.?\d*$/, "Solo se permiten números o decimales")
    .optional(),
  initial_monthly_hours: z
    .string()
    .regex(/^\d*\.?\d*$/, "Solo se permiten números o decimales")
    .optional(),
});

type FormData = z.infer<typeof schema>;

interface EmployeeProfileModalProps {
  open: boolean;
  employee: UserOut;
  onClose: () => void;
  isRRHH: boolean;
  onUpdate: (updatedEmployee: UserOut) => void;
}

export function EmployeeProfileModal({
  open,
  employee,
  onClose,
  isRRHH,
  onUpdate,
}: EmployeeProfileModalProps) {
  const { user: currentUser, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: employee.full_name || "",
      username: employee.username,
      email: employee.email,
      initial_vacation_days: employee.initial_vacation_days?.toString() || "",
      initial_weekly_hours: employee.initial_weekly_hours?.toString() || "",
      initial_monthly_hours: employee.initial_monthly_hours?.toString() || "",
    },
  });

  useEffect(() => {
    reset({
      full_name: employee.full_name || "",
      username: employee.username,
      email: employee.email,
      initial_vacation_days: employee.initial_vacation_days?.toString() || "",
      initial_weekly_hours: employee.initial_weekly_hours?.toString() || "",
      initial_monthly_hours: employee.initial_monthly_hours?.toString() || "",
    });
  }, [employee, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      const payload: UserUpdate = {
        full_name: data.full_name.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        initial_vacation_days: data.initial_vacation_days
          ? Number(data.initial_vacation_days)
          : employee.initial_vacation_days,
        initial_weekly_hours: data.initial_weekly_hours
          ? Number(data.initial_weekly_hours)
          : employee.initial_weekly_hours,
        initial_monthly_hours: data.initial_monthly_hours
          ? Number(data.initial_monthly_hours)
          : employee.initial_monthly_hours,
      };

      const updatedUser = await updateUser(employee.id, payload);

      if (updatedUser) {
        onUpdate(updatedUser);
        toast({
          title: "Cambios guardados",
          description: "Los datos del empleado se actualizaron correctamente",
        });
        onClose();
      }
    } catch (err: any) {
      toast({
        title: "Error al guardar",
        description: err.message || "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (!employee || !isRRHH) return;
    if (currentUser?.id === employee.id) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminar tu propio usuario.",
        variant: "destructive",
      });
      return;
    }
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(employee.id);
      onUpdate({ ...employee, is_active: false });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      });
      onClose();
    } catch (err: any) {
      toast({
        title: "Error al eliminar",
        description: err.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={employee.avatar}
              alt={employee.full_name || employee.username}
              fallback={getInitials(employee.full_name || employee.username)}
            />

            <div className="space-y-1">
              <DialogTitle className="text-xl">
                {employee.full_name || employee.username}
              </DialogTitle>
              <DialogDescription>
                Editar información del empleado
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre completo</Label>
                  <Input
                    id="full_name"
                    {...register("full_name")}
                    disabled={isSaving}
                    placeholder="Nombre completo"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    disabled={isSaving}
                    placeholder="Username"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    disabled={isSaving}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Input
                    value={employee.role}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Días de vacaciones</Label>
                  <Input
                    {...register("initial_vacation_days")}
                    disabled={isSaving}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Horas semanales</Label>
                  <Input
                    {...register("initial_weekly_hours")}
                    disabled={isSaving}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Horas mensuales</Label>
                  <Input
                    {...register("initial_monthly_hours")}
                    disabled={isSaving}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={employee.is_active ? "Activo" : "Inactivo"}
                      disabled
                      className="bg-muted text-muted-foreground"
                    />
                    <Badge
                      variant={employee.is_active ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {employee.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 border-t">
                <div className="flex gap-2 order-2 sm:order-1">
                  {isRRHH && currentUser?.id !== employee.id && (
                    <Button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSaving}
                      variant="outline"
                      className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive bg-transparent"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Eliminar"
                      )}
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={isSaving || !isDirty}
                  className="order-1 sm:order-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
