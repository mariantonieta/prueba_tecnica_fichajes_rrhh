import { useState } from "react";
import { Button } from "../ui/button";
import { RegisterForm } from "./register-form";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function RegisterUserModal() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <PlusCircle className="h-4 w-4 text-primary" />
            </div>
            Nuevo Empleado
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Agregar nuevo colaborador
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
