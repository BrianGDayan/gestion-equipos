'use client';

import React from 'react';
import TablaEquipos from "@/components/TablaEquipos"; 

export default function PaginaEquipos() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Encabezado simple */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Flota</h1>
        <p className="text-muted-foreground">Administración técnica, ubicación y estado de todos los activos.</p>
      </div>

      <TablaEquipos />
    </div>
  );
}