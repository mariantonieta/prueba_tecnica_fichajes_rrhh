import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { authService } from "../../services/auth/authService";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: "EMPLOYEE" | "RRHH";
  exp: number;
}

const schema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authService.login(data);
      console.log("Login response:", result);
      if (!result?.access_token)
        throw new Error("No access token received from backend");

      login(result.access_token);

      const decoded: DecodedToken = jwtDecode(result.access_token);

      navigate("/home");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while logging in.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        id="usernameOrEmail"
        label="Email or Username"
        error={errors.usernameOrEmail?.message}
      >
        <Input
          id="usernameOrEmail"
          placeholder="maria or your@email.com"
          {...register("usernameOrEmail")}
        />
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

      <Button
        type="submit"
        className="w-full"
        variant={"black"}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
