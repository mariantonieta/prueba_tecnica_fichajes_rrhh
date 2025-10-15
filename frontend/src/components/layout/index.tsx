import type { ReactNode } from "react";
import { Header } from "../header";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../ui/loader";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  if (!user) return <Loader text="Cargando usuario..." />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        userName={user.full_name || user.username}
        userInitials={user.full_name?.[0] || "U"}
        role={user.role}
      />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
