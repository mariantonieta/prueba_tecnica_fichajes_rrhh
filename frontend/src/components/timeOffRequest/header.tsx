import { Button } from "../ui/button" 
import { CalendarIcon } from "lucide-react"

interface HeaderProps {
  showForm: boolean
  onToggleForm: () => void
}

export default function Header({ showForm, onToggleForm }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Permisos</h1>
        <p className="text-muted-foreground mt-2">Solicita tus días de vacaciones o permisos</p>
      </div>
      <Button onClick={onToggleForm} size="lg" className="gap-2">
        <CalendarIcon className="h-5 w-5" />
        {showForm ? "Cerrar" : "Crear Permiso"}
      </Button>
    </div>
  )
}