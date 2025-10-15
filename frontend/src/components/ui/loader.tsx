import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

export function Loader({ 
  text = "Cargando...", 
  className,
  ...props 
}: LoaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-muted-foreground",
        className
      )} 
      {...props}
    >
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  )
}