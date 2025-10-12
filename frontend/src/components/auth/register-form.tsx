import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { authService } from "../../services/auth/authService";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    fullname: z.string().min(2, "Full name must be at least 2 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string().min(6, "Please confirm your password"),
    role: z.enum(["EMPLOYEE", "RRHH"], { required_error: "Role is required" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
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
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function RegisterForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register(data);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        id="username"
        label="Username"
        error={errors.username?.message}
      >
        <Input id="username" placeholder="johndoe" {...register("username")} />
      </FormField>

      <FormField
        id="fullname"
        label="Full Name"
        error={errors.fullname?.message}
      >
        <Input id="fullname" placeholder="John Doe" {...register("fullname")} />
      </FormField>

      <FormField id="email" label="Email Address" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          {...register("email")}
        />
      </FormField>

      <FormField id="role" label="Role" error={errors.role?.message}>
        <Select
          id="role"
          {...register("role")}
          onChange={(e) => setValue("role", e.target.value as FormData["role"])}
        >
          <SelectItem value="EMPLOYEE">Employee</SelectItem>
          <SelectItem value="RRHH">RRHH</SelectItem>
        </Select>
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
      </FormField>

      <FormField
        id="confirm_password"
        label="Confirm Password"
        error={errors.confirm_password?.message}
      >
        <Input
          id="confirm_password"
          type="password"
          placeholder="••••••••"
          {...register("confirm_password")}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>
          Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-gray-700 underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </form>
  );
}
