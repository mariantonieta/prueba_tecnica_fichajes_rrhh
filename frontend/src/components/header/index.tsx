import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  userInitials?: string;
}

export function Header({
  userName = "Usuario",
  userAvatar,
  userInitials = "U",
}: HeaderProps) {
  const navigate = useNavigate();

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
            Fichaje RRHH
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
          >
            Inicio
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Calendario
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Solicitudes
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Informes
          </a>
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
            onClick={() => navigate("/profile")} // <-- Aquí navegamos al perfil
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
        </div>
      </div>
    </header>
  );
}
