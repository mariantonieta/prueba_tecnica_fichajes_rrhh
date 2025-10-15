import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/layout";
import EmployeeDashboard from "./pages/dashboard/employeeDasboard";
import RRHDDashboard from "./pages/dashboard/rrhhDasboard";
import "./index.css";
import ProfilePage from "./pages/profile";
import RequestAdjustments from "./pages/requestAjustments";
import EmployeeTimeTracking from "./pages/employeeTimeTracking";
import { ToastProvider } from "./hooks/use-toast";
import TimeOffRequest from "./pages/timeOffRequest";
import ReportEmployee from "./pages/reportEmployee";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { role, isLoading } = useAuth();

  if (isLoading) return <div className="text-center py-12">Cargando...</div>;

  if (!role) return <Navigate to="/login" replace />;

  return children;
}

function HomeRouter() {
  const { role, isLoading } = useAuth();

  if (isLoading) return <div className="text-center py-12">Cargando...</div>;

  return role === "RRHH" ? <RRHDDashboard /> : <EmployeeDashboard />;
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <ToastProvider>
      <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          

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
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/adjustments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RequestAdjustments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-time-tracking"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EmployeeTimeTracking />
                  </Layout>
                </ProtectedRoute>
              }
            />
    <Route
              path="/time-off-request"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TimeOffRequest />
                  </Layout>
                </ProtectedRoute>
              }
            />
              <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportEmployee />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
      </AuthProvider>
        </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>

);
