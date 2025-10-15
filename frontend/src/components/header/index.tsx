import { LogOut, Menu, User, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { UserAvatar } from "../ui/avatar";
import { useState } from "react";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  userInitials?: string;
  role?: "RRHH" | "EMPLOYEE";
}

export function Header({
  userName = "Usuario",
  userAvatar,
  userInitials = "U",
  role,
}: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isHR = role === "RRHH";

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900">
            Fichaje {isHR ? "RRHH" : "Empleado"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/home"
            className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
          >
            Inicio
          </Link>

          <Link
            to="/adjustments"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Solicitudes Fichajes
          </Link>

          {isHR && (
            <Link
              to="/employee-time-tracking"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Fichajes de empleados
            </Link>
          )}

          <Link
            to="/time-off-request"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Permisos/Vacaciones
          </Link>

          <Link
            to="/report"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Informe
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <UserAvatar
                  src={userAvatar}
                  alt={userName}
                  fallback={userInitials}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-lg border"
            >
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">
                  {isHR ? "RRHH" : "Empleado"}
                </p>
              </div>

              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer px-3 py-2.5 text-sm rounded-lg"
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive cursor-pointer px-3 py-2.5 text-sm rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link
            to="/home"
            className="block px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/adjustments"
            className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Solicitudes de fichaje
          </Link>
          {isHR && (
            <Link
              to="/employee-time-tracking"
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Fichajes de empleados
            </Link>
          )}
          <Link
            to="/time-off-request"
            className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Permisos/Vacaciones
          </Link>
          <Link
            to="/report"
            className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Informe
          </Link>
        </nav>
      )}
    </header>
  );
}
