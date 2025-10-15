import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { UserUpdate } from "../../services/users/userTypes";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function ProfilePage() {
  const { user, role, updateUser } = useAuth();
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
        username: user.username,
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
      await updateUser(user.id, data);
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

  const handleBack = () => navigate(-1);

  if (!user)
    return (
      <p className="text-center mt-20 text-muted-foreground">Cargando...</p>
    );

  return (
    <main className="min-h-screen flex justify-center py-12 bg-background">
      <div className="bg-card p-10 rounded-2xl w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Mi Perfil</h1>

        <Button
          variant="secondary"
          onClick={handleBack}
          className="mb-4 w-full"
        >
          Atrás
        </Button>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="full_name">Nombre</Label>
            <Input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Nombre completo"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Usuario"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Rol</Label>
            <Input
              id="role"
              value={
                typeof user.role === "string"
                  ? user.role
                  : user.role?.name || ""
              }
              readOnly
              disabled
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="create_date">Fecha de creación</Label>
            <Input
              id="create_date"
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
              disabled
            />
          </div>
        </div>

        <Button className="w-full bg-black text-white" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </div>
    </main>
  );
}
