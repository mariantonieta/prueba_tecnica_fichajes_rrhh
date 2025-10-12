import React from "react";
import { LoginForm } from "../../components/auth/login-form";
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}
