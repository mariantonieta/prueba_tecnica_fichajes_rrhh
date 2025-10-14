import React from "react";
import { RegisterForm } from "../../components/auth/register-form";
import { useNavigate } from "react-router-dom"; 
import { Button } from "../../components/ui/button";
export default function RegisterPage() {
   const navigate = useNavigate();
   
    const handleBack = () => {
    navigate(-1);
  };
  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 relative">
  <div className="absolute left-6 top-1/2 -translate-y-1/2">
    <Button
      onClick={handleBack}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800"
    >
      Atrás
    </Button>
  </div>

  <div className="w-full max-w-lg">
    <RegisterForm />
    <p className="text-center text-sm text-gray-500 mt-4">
      Serás redirigido al historial de fichajes después de crear el usuario.
    </p>
  </div>
</div>

  );
}
