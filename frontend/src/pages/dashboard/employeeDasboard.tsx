import React, { useEffect, useState } from "react";
import { DashboardBase } from "../../components/dashboard";
import { userService } from "../../services/users/userService";
import { useToast } from "../../hooks/use-toast";
import { Loader } from "../../components/ui/loader";
import { UserOut } from "../../services/users/userTypes";

export default function EmployeeDashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
      } catch (error: any) {
        toast({
          title: "Error al cargar usuario",
          description: error.message || "No se pudo obtener el usuario actual.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <Loader /> Cargando dashboard...
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        No se pudo cargar el usuario
      </div>
    );

  return (
    <DashboardBase
      userName={user.full_name || user.username}
      role={user.role}
      userId={user.id}
      currentUserId={user.id}
    />
  );
}
