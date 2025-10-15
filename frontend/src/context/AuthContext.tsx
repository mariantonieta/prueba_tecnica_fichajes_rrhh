import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../hooks/use-toast";

import { userService } from "../services/users/userService";
import { UserOut, UserUpdate } from "../services/users/userTypes";

interface DecodedToken {
  sub: string;
  role: "EMPLOYEE" | "RRHH";
  exp: number;
}

interface AuthContextType {
  user: UserOut | null;
  role: DecodedToken["role"] | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (
    userId: string,
    data: UserUpdate
  ) => Promise<UserOut | undefined>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [role, setRole] = useState<DecodedToken["role"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setRole(decoded.role);
          await loadUser(decoded.sub);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUser = async (userId: string) => {
    try {
      const data = await userService.getUser(userId);
      setUser(data);
    } catch (err) {
      console.error("Error cargando usuario", err);
      logout();
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    const decoded: DecodedToken = jwtDecode(token);
    setRole(decoded.role);
    await loadUser(decoded.sub);
    toast({
      title: "Bienvenido",
      description: `Has ingresado como "${decoded.role}"`,
    });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  const updateUser = async (
    userId: string,
    data: UserUpdate
  ): Promise<UserOut | undefined> => {
    try {
      const updatedUser = await userService.updateUser(userId, data);

      if (user?.id === userId) {
        setUser(updatedUser);
      }

      return updatedUser;
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
      return undefined;
    }
  };
  const deleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    }
  };

  const value = useMemo(
    () => ({ user, role, isLoading, login, logout, updateUser, deleteUser }),
    [user, role, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
