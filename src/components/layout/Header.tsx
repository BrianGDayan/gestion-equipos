"use client";

import { Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.rol || "Admin");
      } catch (e) {}
    }
  }, []);

  return (
    // CAMBIO DE COLOR: bg-slate-800 (Gris Azulado Oscuro) en lugar de bg-primary
    <header className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between bg-slate-800 px-6 shadow-md border-b border-slate-700">
      
      {/* SECCIÓN IZQUIERDA: Identidad del Sistema */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="bg-white p-1.5 rounded-md shadow-sm">
            <Image 
              src="/img/logo.png" 
              alt="GECO" 
              width={120} 
              height={40} 
              className="h-8 w-auto object-contain" 
              priority
            />
        </div>
        
        <div className="hidden md:block w-[1px] h-10 bg-white/20"></div>
        
        {/* TÍTULO DEL SISTEMA */}
        <div className="hidden md:block text-white">
           <h1 className="text-2xl font-bold tracking-wide leading-none">
             Sistema de Gestión de Equipos
           </h1>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Usuario */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <Bell className="h-6 w-6" /> 
          {/* El borde del punto rojo ahora coincide con el fondo slate-800 */}
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-slate-800" />
        </button>
        
        <div className="h-8 w-[1px] bg-white/20 mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold leading-none text-white capitalize">{userName}</p>
            <p className="text-xs text-blue-200 opacity-90 mt-1">Sesión Activa</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-sm hover:bg-white/20 transition-colors cursor-pointer">
            <User className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}