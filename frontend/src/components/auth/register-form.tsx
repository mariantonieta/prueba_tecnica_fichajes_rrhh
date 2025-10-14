import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { userService } from "../../services/users/userService";
import { useNavigate } from "react-router-dom";
import { Loader } from "../ui/loader";
import { Card, CardHeader, CardContent, CardFooter } from  "../ui/card";

const schema = z
  .object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    full_name: z.string().min(2, "El nombre completo debe tener al menos 2 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirm_password: z.string().min(6, "Confirma tu contraseña"),
    initial_vacation_days: z.number().optional(),
    initial_weekly_hours: z.number().optional(),
    initial_monthly_hours: z.number().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Las contraseñas no coinciden",
  });

type FormData = z.infer<typeof schema>;

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-medium text-sm text-gray-700">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function RegisterForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await userService.createUser({
        ...data,
        role: "EMPLOYEE",
      });

      toast({
        title: "Usuario creado correctamente",
        description: "Redirigiendo al historial de fichajes...",
      });

      setTimeout(() => {
        navigate("/employee-time-tracking");
      }, 1500);
    } catch (error: any) {
      toast({
        title: " Error al crear el usuario",
        description: error?.response?.data?.detail || "Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-lg border border-gray-200 rounded-2xl">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Crear cuenta de empleado
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Ingresa los datos del nuevo empleado
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          <FormField id="username" label="Nombre de usuario" error={errors.username?.message}>
            <Input placeholder="johndoe" {...register("username")} />
          </FormField>

          <FormField id="full_name" label="Nombre completo" error={errors.full_name?.message}>
            <Input placeholder="John Doe" {...register("full_name")} />
          </FormField>

          <FormField id="email" label="Correo electrónico" error={errors.email?.message}>
            <Input type="email" placeholder="usuario@empresa.com" {...register("email")} />
          </FormField>

          <FormField id="password" label="Contraseña" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register("password")} />
          </FormField>

          <FormField
            id="confirm_password"
            label="Confirmar contraseña"
            error={errors.confirm_password?.message}
          >
            <Input type="password" placeholder="••••••••" {...register("confirm_password")} />
          </FormField>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <FormField id="initial_vacation_days" label="Vacaciones iniciales">
              <Input
                type="number"
                min={0}
                {...register("initial_vacation_days", { valueAsNumber: true })}
              />
            </FormField>

            <FormField id="initial_weekly_hours" label="Horas semanales">
              <Input
                type="number"
                min={0}
                {...register("initial_weekly_hours", { valueAsNumber: true })}
              />
            </FormField>

            <FormField id="initial_monthly_hours" label="Horas mensuales">
              <Input
                type="number"
                min={0}
                {...register("initial_monthly_hours", { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader/>
                Creando usuario...
              </>
            ) : (
              "Crear usuario"
            )}
          </Button>
      </CardFooter>
      </form>
    </Card>
  );
}
