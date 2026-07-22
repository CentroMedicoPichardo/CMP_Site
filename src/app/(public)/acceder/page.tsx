"use client";

import React, { useState } from "react";
import { LoginLayout } from "@/components/public/auth/LoginLayout";
import { HeroAcceder } from "@/components/public/auth/HeroAcceder";
import { LoginForm } from "@/components/public/auth/LoginForm";
import { RegisterForm } from "@/components/public/auth/RegisterForm";
import { LoginMfaForm } from "@/components/public/auth/LoginMfaForm";

export default function AccederPage() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [necesitaMfa, setNecesitaMfa] = useState(false);
  const [emailTemp, setEmailTemp] = useState("");

  const handleCambiarModo = (
    nuevoModo: "login" | "registro",
  ) => {
    setModo(nuevoModo);
    setNecesitaMfa(false);
  };

  const handleRegistroExitoso = () => {
    setModo("login");
    setNecesitaMfa(false);
  };

  const renderFormulario = () => {
    if (necesitaMfa) {
      return (
        <LoginMfaForm
          email={emailTemp}
          onCancel={() => setNecesitaMfa(false)}
        />
      );
    }

    switch (modo) {
      case "login":
        return (
          <LoginForm
            onMfaRequired={(email) => {
              setEmailTemp(email);
              setNecesitaMfa(true);
            }}
          />
        );

      case "registro":
        return (
          <RegisterForm
            onRegistroExitoso={handleRegistroExitoso}
          />
        );

      default:
        return null;
    }
  };

  return (
    <LoginLayout>
      {/* Se conserva el Hero exactamente como estaba */}
      <HeroAcceder
        modo={modo}
        onCambiarModo={handleCambiarModo}
      />

      {/* Se conserva el espacio original del formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full">
          {renderFormulario()}

          {/* Cambio de formulario solo cuando el Hero desaparece */}
          {!necesitaMfa && (
            <div className="mt-6 text-center lg:hidden">
              <p className="text-sm text-gray-600">
                {modo === "login"
                  ? "¿Aún no tienes una cuenta?"
                  : "¿Ya tienes una cuenta?"}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleCambiarModo(
                    modo === "login" ? "registro" : "login",
                  )
                }
                className="
                  mt-2
                  text-sm
                  font-semibold
                  text-[#07466c]
                  underline-offset-4
                  transition-colors
                  hover:text-[#f5b400]
                  hover:underline
                "
              >
                {modo === "login"
                  ? "Crear una cuenta"
                  : "Iniciar sesión"}
              </button>
            </div>
          )}
        </div>
      </div>
    </LoginLayout>
  );
}