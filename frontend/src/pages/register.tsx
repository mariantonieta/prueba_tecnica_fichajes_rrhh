import { RegisterForm } from "../components/auth/register-form";
import React from "react";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
