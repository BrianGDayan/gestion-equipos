"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginDto } from "@/lib/auth";
import ModalError from "@/components/ModalError";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dto: LoginDto = { idUsuario: Number(usuario), clave };

    try {
      await login(dto);
      router.push("/");
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    // py-20 para dar espacio arriba, igual que antes
    <div className="container mx-auto flex justify-center py-24 px-4">
      
      {/* CAMBIO CLAVE: max-w-lg (512px) en lugar de max-w-md (448px) para que sea más ancho */}
      <div className="w-full max-w-lg">
        
        {/* Título más grande y con más margen inferior (mb-10) */}
        <h1 className="text-3xl font-semibold mb-10 text-center text-gray-text">
          Iniciar sesión
        </h1>
        
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="ID Usuario"
            required
            // CAMBIOS: 
            // - py-3 px-4: Más alto y con más espacio a los costados
            // - text-lg: Letra más grande
            // - bg-white: Asegurar fondo blanco
            className="border border-gray-border py-3 px-4 mb-5 rounded shadow-sm focus:outline-none focus:border-primary font-sans text-lg text-gray-text bg-white placeholder-gray-400"
          />
          
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Contraseña"
            required
            // Mismos cambios de tamaño aquí
            className="border border-gray-border py-3 px-4 mb-8 rounded shadow-sm focus:outline-none focus:border-primary font-sans text-lg text-gray-text bg-white placeholder-gray-400"
          />
          
          <button 
            type="submit" 
            // Botón más alto (py-3) y letra un poco más grande
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded shadow transition-colors font-sans text-lg"
          >
            Ingresar
          </button>
        </form>

        <ModalError show={showError} onClose={() => setShowError(false)} mensaje="Error al iniciar sesión." />
      </div>
    </div>
  );
}