"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginDto } from "@/lib/auth";
import ModalError from "@/components/ModalError";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const dto: LoginDto = { idUsuario: Number(usuario), clave };

    try {
      await login(dto);
      // Redirigir al dashboard/home
      router.push("/"); 
    } catch (err) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-bg">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Iniciar sesión</h1>
        
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-text mb-1">ID Usuario</label>
          <input
            type="number"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingrese ID"
            required
            className="border border-gray-border p-2 mb-4 rounded focus:outline-none focus:border-primary"
          />
          
          <label className="text-sm font-semibold text-gray-text mb-1">Contraseña</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="********"
            required
            className="border border-gray-border p-2 mb-6 rounded focus:outline-none focus:border-primary"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-3 bg-primary hover:bg-primary-dark text-white font-bold rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "INGRESAR"}
          </button>
        </form>

        <ModalError 
            show={showError} 
            onClose={() => setShowError(false)} 
            mensaje="Credenciales incorrectas o error de conexión." 
        />
      </div>
    </div>
  );
}