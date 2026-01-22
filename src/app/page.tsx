import React from 'react';
import Link from 'next/link';
import { 
  Activity, Truck, AlertTriangle, ClipboardList, 
  ArrowUpRight, Wrench, CheckCircle2, Package 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data-dashboard"; // Importamos la función directa

// Al hacer el componente 'async', se convierte en Server Component
export default async function Dashboard() {
  // Llamamos a la BD directamente en el servidor.
  // Next.js espera a que esto termine antes de enviar el HTML al usuario.
  const data = await getDashboardData();

  // Cálculos simples
  const porcentajeOperativo = data.kpis.total > 0 
    ? Math.round((data.kpis.operativos / data.kpis.total) * 100) 
    : 0;
  
  const disponibles = data.kpis.total - (data.kpis.operativos + data.kpis.taller);

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Panel de Gestión</h1>
          <p className="text-lg text-muted-foreground mt-2">Visión general del estado operativo de la flota.</p>
        </div>
        <div>
          <Link href="/partes/nuevo">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:scale-105 transition-transform">
              <ClipboardList className="mr-2 h-5 w-5" /> Cargar Parte Diario
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI: En Obra */}
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos en Obra</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.operativos} / {data.kpis.total}</div>
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs font-normal bg-green-100 text-green-700 hover:bg-green-100">
                {porcentajeOperativo}% Operativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* KPI: Disponibles */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Depósito / Disponibles</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disponibles}</div>
            <p className="text-xs text-muted-foreground mt-1">Listos para asignar</p>
          </CardContent>
        </Card>

        {/* KPI: Taller */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Taller</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.taller}</div>
            <p className="text-xs text-muted-foreground mt-1">Mantenimiento correctivo</p>
          </CardContent>
        </Card>

        {/* KPI: Stock */}
        <Card className={`shadow-sm ${data.kpis.stock_bajo > 0 ? 'border-red-200 bg-red-50/30' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Repuestos</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${data.kpis.stock_bajo > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.kpis.stock_bajo > 0 ? 'text-red-600' : ''}`}>
              {data.kpis.stock_bajo}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ítems con stock bajo</p>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* ACTIVIDAD */}
        <Card className="col-span-4 shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Actividad Reciente
            </CardTitle>
            <CardDescription>Últimos partes de trabajo procesados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.actividad.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay actividad registrada hoy.</div>
              ) : (
                data.actividad.map((p: any) => (
                  <div key={Number(p.nro_parte)} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{p.equipo.nombre_equipo}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.equipo.marca} • <span className="text-primary font-medium">{Number(p.horas_trabajadas).toFixed(1)} hs</span> trabajadas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{p.fecha_carga.toLocaleDateString('es-AR')}</p>
                      <p className="text-xs text-muted-foreground">{p.obra_ubicacion}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* ACCESOS */}
        <Card className="col-span-3 shadow-sm border-border">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Gestión administrativa.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/equipos">
              <Button variant="outline" className="w-full justify-between h-14 hover:border-primary/50 hover:bg-primary/5 group">
                <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-muted-foreground group-hover:text-primary" /> Inventario Completo</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/repuestos">
              <Button variant="outline" className="w-full justify-between h-14 hover:border-primary/50 hover:bg-primary/5 group">
                <span className="flex items-center gap-2"><Package className="h-5 w-5 text-muted-foreground group-hover:text-primary" /> Pañol y Repuestos</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}