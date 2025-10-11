import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

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
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: UserUpdate) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [role, setRole] = useState<DecodedToken["role"] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setRole(decoded.role);
          loadUser(decoded.sub);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        localStorage.removeItem("access_token");
      }
    }
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
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setRole(null);
  };

  const updateUser = async (data: UserUpdate) => {
    if (!user) return;
    const res = await userService.updateUser(user.id, data);
    const updatedUser = await userService.getUser(user.id);
    setUser(updatedUser);
    alert(res.message);
  };

  const deleteUser = async (userId: string) => {
    await userService.deleteUser(userId);
    setUser(null);
    localStorage.removeItem("access_token");
    alert("Usuario eliminado");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, role, login, logout, updateUser, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
