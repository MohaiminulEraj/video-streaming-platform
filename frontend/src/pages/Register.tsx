import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { RegistrationForm } from "../components/auth/RegistrationForm";
import type { RegistrationData } from "../types";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleRegister = async (data: RegistrationData) => {
    // TODO: Integrate with backend
    // Temporary mock registration
    login({
      id: "1",
      email: data.email,
      name: data.username,
    });
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create your account
        </h2>
        <RegistrationForm onSubmit={handleRegister} />
      </div>
    </div>
  );
};
