import { Bell, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isHR = role === "RRHH";

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            Fichaje {isHR ? "RRHH" : "Empleado"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
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
            Solicitudes
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
            to="/reports"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Informes
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="relative rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5 text-gray-700" />
          </button>

          <div
            className="relative h-10 w-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white font-medium">{userInitials}</span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
