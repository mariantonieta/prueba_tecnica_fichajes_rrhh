import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export function Home() {
  const { role, logout } = useAuth();

  if (!role) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">You are not logged in</h1>
        <Link to="/login" className="text-blue-500 underline mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>

      {role === "EMPLOYEE" && (
        <div className="bg-green-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold">Employee Dashboard</h2>
          <p>View your tasks, check-ins, and profile.</p>
        </div>
      )}

      {role === "RRHH" && (
        <div className="bg-blue-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold">HR Dashboard</h2>
          <p>Manage employees, view reports, and create accounts.</p>
          <Link
            to="/register"
            className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Account
          </Link>
        </div>
      )}

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
