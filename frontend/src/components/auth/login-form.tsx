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
      console.log("Login result:", result);

      if (!result?.access_token) {
        throw new Error("No access token received from backend");
      }

      login(result.access_token);

      const decoded: DecodedToken = jwtDecode(result.access_token);
      console.log("Decoded token:", decoded);

      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
      });

      console.log("Redirecting to /home...");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
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
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="usernameOrEmail"
          type="text"
          placeholder="maria or your@email.com"
          {...register("usernameOrEmail")}
        />
        {errors.usernameOrEmail && (
          <p className="text-sm text-red-500">
            {errors.usernameOrEmail.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>
          Demo: use{" "}
          <span className="font-medium text-gray-700">hr@company.com</span> for
          HR
        </p>
        <p>
          or{" "}
          <span className="font-medium text-gray-700">
            employee@company.com
          </span>{" "}
          for Employee
        </p>
      </div>
    </form>
  );
}
