import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

export function Loader({ text = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex h-screen items-center justify-center text-gray-600">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      {text}
    </div>
  );
}
