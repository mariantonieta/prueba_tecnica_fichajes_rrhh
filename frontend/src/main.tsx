import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/layout";
import EmployeeDashboard from "./pages/dashboard/employeeDasboard";
import RRHDDashboard from "./pages/dashboard/rrhhDasboard";
import "./index.css";
import ProfilePage from "./pages/profile-dasboard";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return children;
}

function HomeRouter() {
  const { role } = useAuth();
  return role === "RRHH" ? <RRHDDashboard /> : <EmployeeDashboard />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeRouter />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
