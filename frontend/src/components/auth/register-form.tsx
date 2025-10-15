import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { userService } from "../../services/users/userService";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { UserCheck } from "lucide-react";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    full_name: z
      .string()
      .min(2, "El nombre completo debe tener al menos 2 caracteres"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirm_password: z.string().min(6, "Confirma tu contraseña"),
    initial_vacation_days: z
      .string()
      .regex(/^\d*$/, "Solo se permiten números")
      .optional(),
    initial_weekly_hours: z
      .string()
      .nonempty("Las horas semanales son obligatorias")
      .regex(/^\d+$/, "Solo se permiten números"),

    initial_monthly_hours: z
      .string()
      .regex(/^\d*$/, "Solo se permiten números")
      .optional(),
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
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="font-medium text-sm flex items-center gap-2"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();

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
        initial_vacation_days: Number(data.initial_vacation_days) || 0,
        initial_weekly_hours: Number(data.initial_weekly_hours) || 0,
        initial_monthly_hours: Number(data.initial_monthly_hours) || 0,
      });

      toast({
        title: "Usuario creado",
        description: "El empleado ha sido registrado exitosamente",
      });
      window.location.reload();

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error al crear el usuario",
        description: error?.response?.data?.detail || "Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <UserCheck className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Nuevo Empleado</h2>
        <p className="text-sm text-muted-foreground">
          Completa la información del nuevo colaborador
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="username"
              label="Usuario"
              error={errors.username?.message}
            >
              <Input placeholder="johndoe" {...register("username")} />
            </FormField>

            <FormField
              id="full_name"
              label="Nombre completo"
              error={errors.full_name?.message}
            >
              <Input placeholder="John Doe" {...register("full_name")} />
            </FormField>
          </div>

          <FormField
            id="email"
            label="Correo electrónico"
            error={errors.email?.message}
          >
            <Input
              type="email"
              placeholder="usuario@empresa.com"
              {...register("email")}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="password"
              label="Contraseña"
              error={errors.password?.message}
            >
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
            </FormField>

            <FormField
              id="confirm_password"
              label="Confirmar contraseña"
              error={errors.confirm_password?.message}
            >
              <Input
                type="password"
                placeholder="••••••••"
                {...register("confirm_password")}
              />
            </FormField>
          </div>

          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField id="initial_vacation_days" label="Días de vacaciones">
                <Input
                  type="text"
                  placeholder="0"
                  {...register("initial_vacation_days")}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      ""
                    );
                  }}
                />
              </FormField>

              <FormField
                id="initial_weekly_hours"
                label="Horas semanales"
                error={errors.initial_weekly_hours?.message}
              >
                <Input
                  type="text"
                  placeholder="0"
                  {...register("initial_weekly_hours")}
                />
              </FormField>

              <FormField id="initial_monthly_hours" label="Horas mensuales">
                <Input
                  type="text"
                  placeholder="0"
                  {...register("initial_monthly_hours")}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      ""
                    );
                  }}
                />
              </FormField>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            variant="black"
          >
            {isSubmitting ? "Creando..." : "Crear empleado"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
