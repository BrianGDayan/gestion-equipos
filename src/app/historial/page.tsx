'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, Calendar, Filter, Download, 
  ArrowRightCircle, Truck, Info, Loader2
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Movimiento {
  id: number;
  fecha_registro: string;
  equipo_codigo: string;
  ubicacion: string;
  equipo: { nombre_equipo: string; marca: string; tipo: { referencia: string } };
  usuario: { id_usuario: number };
}

export default function HistorialGlobal() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [equiposList, setEquiposList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEquipo, setFiltroEquipo] = useState("TODOS");

  useEffect(() => {
    fetch('/api/equipos').then(res => res.json()).then(setEquiposList);
  }, []);

  const cargarMovimientos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroEquipo !== "TODOS") params.append("equipo", filtroEquipo);

      const res = await fetch(`/api/historial?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar datos");
      const data = await res.json();
      setMovimientos(data);
    } catch (err) {
      toast.error("Error al cargar el historial");
    } finally {
      setIsLoading(false);
    }
  }, [filtroEquipo]);

  useEffect(() => {
    cargarMovimientos();
  }, [cargarMovimientos]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 1. FILTROS */}
      <Card className="border-border/60 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-end gap-4">
            
            <div className="space-y-2 flex-1 md:max-w-md">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" /> Filtrar por Equipo
              </label>
              <Select value={filtroEquipo} onValueChange={setFiltroEquipo}>
                <SelectTrigger className="bg-white h-10">
                  <SelectValue placeholder="Todos los equipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Toda la flota</SelectItem>
                  {equiposList.map(eq => (
                    <SelectItem key={eq.codigo} value={eq.codigo}>{eq.codigo} - {eq.nombre_equipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="h-10 gap-2 text-primary border-primary/20 hover:bg-primary/5 ml-auto">
              <Download className="h-4 w-4" /> Exportar a Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. TABLA DE HISTORIAL */}
      <Card className="shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-slate-50/50">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Historial de Movimientos
            </CardTitle>
            <CardDescription>Trazabilidad logística y cambios de ubicación.</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono bg-white">
            {movimientos.length} Eventos
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold w-[180px]">Fecha y Hora</TableHead>
                <TableHead className="font-bold">Equipo</TableHead>
                <TableHead className="font-bold">Nueva Ubicación</TableHead>
                <TableHead className="text-right font-bold pr-6">Registrado por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="h-48 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" /> Cargando historial...</TableCell></TableRow>
              ) : movimientos.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-48 text-center text-muted-foreground">No hay movimientos registrados.</TableCell></TableRow>
              ) : (
                movimientos.map((mov) => (
                  <TableRow key={mov.id} className="hover:bg-muted/20">
                    
                    <TableCell className="font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(mov.fecha_registro).toLocaleDateString('es-AR', { 
                          day: '2-digit', month: '2-digit', year: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5" /> {mov.equipo_codigo}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {mov.equipo.nombre_equipo} • {mov.equipo.tipo?.referencia}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ArrowRightCircle className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-slate-700">{mov.ubicacion}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Badge variant="outline" className="font-mono text-xs text-slate-500">
                        ID: {mov.usuario?.id_usuario || 'Auto'}
                      </Badge>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}