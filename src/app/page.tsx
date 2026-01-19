"use client";

import StatCard from "@/components/dashboard/StatCard";
import TablaEquipos from "@/components/TablaEquipos";
import { Truck, AlertTriangle, CheckCircle, MapPin } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      
      {/* 1. Encabezado del Dashboard: Panel de Gestión */}
      {/* Agregamos 'mt-4' o 'pt-2' extra para despegarlo del header */}
      <div className="mt-4 border-b border-border/40 pb-4">
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
          Panel de Gestión
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Visión general del estado operativo de la flota.
        </p>
      </div>

      {/* 2. Tarjetas de Estadísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Equipos"
          value="124"
          description="Activos en inventario"
          icon={Truck}
          variant="primary"
        />
        <StatCard
          title="En Obra"
          value="86"
          description="Asignados a proyectos"
          icon={MapPin}
          variant="accent"
        />
        <StatCard
          title="Disponibles"
          value="38"
          description="En depósito central"
          icon={CheckCircle}
          variant="default"
        />
        <StatCard
          title="En Reparación"
          value="3"
          description="Mantenimiento urgente"
          icon={AlertTriangle}
          variant="secondary"
          trend={{ value: 12, positive: false }}
        />
      </div>

      {/* 3. Tabla Principal */}
      <div className="grid gap-4 md:grid-cols-1">
         <TablaEquipos /> 
      </div>
    </div>
  );
}