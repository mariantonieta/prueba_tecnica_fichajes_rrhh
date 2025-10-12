import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { UserUpdate } from "../../services/users/userTypes";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";

export default function ProfilePage() {
  const { user, role, updateUser, deleteUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<UserUpdate>({
    full_name: user?.full_name || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email,
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSave = async () => {
    if (!user) return;

     const data: UserUpdate = {} as UserUpdate;
  if (form.full_name.trim()) data.full_name = form.full_name.trim();
  if (form.username.trim()) data.username = form.username.trim();
  if (form.email.trim()) data.email = form.email.trim();
    try {
    const updatedUser = await updateUser(user.id, data); 
    toast({
      title: "Usuario actualizado",
      description: "Tus cambios se han guardado correctamente",
      variant: "success",
    });
  } catch (err) {
    toast({
      title: "Error",
      description:
        err instanceof Error ? err.message : "No se pudo guardar los cambios",
      variant: "destructive",
    });
  }
};
  const handleDelete = async () => {
    if (!user) return;

    if (confirm("¿Seguro que quieres eliminar este usuario?")) {
      try {
        await deleteUser(user.id);
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado correctamente",
          variant: "success",
        });
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "No se pudo eliminar el usuario",
          variant: "destructive",
        });
      }
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  if (!user)
    return <p className="text-center mt-20 text-gray-500">Cargando...</p>;

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center py-12">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md space-y-8 mx-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Mi Perfil
        </h1>
        <Button
          onClick={handleBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 mb-4"
        >
          Atrás
        </Button>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rol
            </label>
            <input
              type="text"
              name="role"
              value={
                typeof user.role === "string"
                  ? user.role
                  : user.role?.name || ""
              }
              disabled={role === "EMPLOYEE"}
              readOnly
              className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 shadow-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Fecha de creación
            </label>
            <input
              type="text"
             value={
              user.create_date
                ? new Date(user.create_date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""
            }

              readOnly
              className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 shadow-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>

          {role === "RRHH" && (
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto"
            >
              Eliminar Usuario
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
