import React, { useState, useEffect } from "react";
import { User, X } from "lucide-react";
import { Button } from "../ui/button";
import { UserOut, UserUpdate } from "../../services/users/userTypes";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface EmployeeProfileModalProps {
  employee: UserOut;
  onClose: () => void;
  isRRHH: boolean;
  onUpdate: (updatedEmployee: UserOut) => void;
}

export function EmployeeProfileModal({ 
  employee, 
  onClose, 
  isRRHH, 
  onUpdate 
}: EmployeeProfileModalProps) {
  const { user: currentUser, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<UserUpdate>({
    full_name: employee.full_name || "",
    email: employee.email,
    username: employee.username,
    initial_vacation_days: employee.initial_vacation_days,
    initial_weekly_hours: employee.initial_weekly_hours,
    initial_monthly_hours: employee.initial_monthly_hours,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      full_name: employee.full_name || "",
      email: employee.email,
      username: employee.username,
      initial_vacation_days: employee.initial_vacation_days,
      initial_weekly_hours: employee.initial_weekly_hours,
      initial_monthly_hours: employee.initial_monthly_hours,
    });
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ["initial_vacation_days", "initial_weekly_hours", "initial_monthly_hours"];
    setForm({
      ...form,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (!employee) return;
    
    setIsSaving(true);
    
    try {
      const data: UserUpdate = {};
      if (form.full_name?.trim()) data.full_name = form.full_name.trim();
      if (form.username?.trim()) data.username = form.username.trim();
      if (form.email?.trim()) data.email = form.email.trim();
      data.initial_vacation_days = form.initial_vacation_days;
      data.initial_weekly_hours = form.initial_weekly_hours;
      data.initial_monthly_hours = form.initial_monthly_hours;

      const updatedUser = await updateUser(employee.id, data);
      
      if (updatedUser) {
        onUpdate(updatedUser);
        
        onClose();
        
        toast({
          title: "Cambios guardados",
          description: "Los datos del empleado se actualizaron correctamente",
          variant: "success",
        });
          setTimeout(() => {
    window.location.reload();
  }, 100);

      }
    } catch (err: any) {
      console.error("Error al guardar:", err);
      toast({
        title: "Error al guardar",
        description: err.message || "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };const handleDelete = async () => {
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

    onClose();

    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
      variant: "success",
    });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (err: any) {
    console.error("Error al eliminar:", err);
    toast({
      title: "Error al eliminar",
      description: err.message || "No se pudo eliminar el usuario",
      variant: "destructive",
    });
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
  <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl mx-auto relative p-8 overflow-y-auto max-h-[90vh]">
    <Button
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
      onClick={onClose}
      disabled={isSaving}
    >
      <X className="h-6 w-6" />
    </Button>

    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Editar Perfil - {employee.full_name || employee.username}
    </h2>

    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 rounded-full bg-blue-100">
        <User className="h-10 w-10 text-blue-600" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700">Nombre completo</Label>
          <Input
            name="full_name"
            value={form.full_name || ""}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <Input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            name="email"
            type="email"
            value={form.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            disabled={isSaving}
          />
        </div>

      

        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700">Horas semanales</Label>
          <Input
            name="initial_weekly_hours"
            type="number"
            value={form.initial_weekly_hours || 0}
            onChange={handleChange}
            placeholder="Horas semanales"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            disabled={isSaving}
          />
        </div>
        <div className="flex flex-col">
  <Label className="text-sm font-medium text-gray-700">Horas mensuales</Label>
  <Input
    name="initial_monthly_hours"
    type="number"
    value={form.initial_monthly_hours || 0}
    onChange={handleChange}
    placeholder="Horas mensuales"
    className="w-full px-4 py-2 rounded-xl border border-gray-300 mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
    disabled={isSaving}
  />
</div>

<div className="flex flex-col">
  <Label className="text-sm font-medium text-gray-700">Días de vacaciones</Label>
  <Input
    name="initial_vacation_days"
    type="number"
    value={form.initial_vacation_days || 0}
    onChange={handleChange}
    placeholder="Días de vacaciones"
    className="w-full px-4 py-2 rounded-xl border border-gray-300 mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
    disabled={isSaving}
  />
</div>

      
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700">Rol</Label>
          <Input
            name="role"
            value={employee.role}
            disabled
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed mt-1"
          />
        </div>

        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-700">Estado</Label>
          <Input
            name="is_active"
            value={employee.is_active ? "Activo" : "Inactivo"}
            disabled
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed mt-1"
          />
        </div>
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-end gap-3 mt-8">
      {isRRHH && currentUser?.id !== employee.id && (
        <Button
          onClick={handleDelete}
          disabled={isSaving}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isSaving ? "Eliminando..." : "Eliminar Usuario"}
        </Button>
      )}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
      <Button
        onClick={onClose}
        disabled={isSaving}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800"
      >
        Cancelar
      </Button>
    </div>
  </div>
</div>

  );
}