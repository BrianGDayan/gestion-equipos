'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, Calendar, Filter, Search, Download, 
  AlertCircle, CheckCircle2, Droplets, HardHat, Gauge 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Parte {
  nro_parte: string;
  fecha_parte: string;
  equipo_codigo: string;
  obra_ubicacion: string;
  horas_trabajadas: number;
  combustible_litros: number;
  observaciones: string;
  equipo: { nombre_equipo: string; marca: string };
  usuario: { id_usuario: number };
}

export default function HistorialPartes() {
  const [partes, setPartes] = useState<Parte[]>([]);
  const [equiposList, setEquiposList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [filtroEquipo, setFiltroEquipo] = useState("TODOS");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Carga inicial de equipos para el filtro
  useEffect(() => {
    fetch('/api/equipos').then(res => res.json()).then(setEquiposList);
  }, []);

  const cargarPartes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroEquipo !== "TODOS") params.append("equipo", filtroEquipo);
      if (fechaDesde) params.append("desde", fechaDesde);
      if (fechaHasta) params.append("hasta", fechaHasta);

      const res = await fetch(`/api/partes?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar datos");
      const data = await res.json();
      setPartes(data);
    } catch (err) {
      toast.error("Error de carga");
    } finally {
      setIsLoading(false);
    }
  }, [filtroEquipo, fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarPartes();
  }, [cargarPartes]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 1. BARRA DE HERRAMIENTAS Y FILTROS */}
      <Card className="border-border/60 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-end gap-4">
            
            <div className="space-y-2 flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" /> Equipo
              </label>
              <Select value={filtroEquipo} onValueChange={setFiltroEquipo}>
                <SelectTrigger className="bg-white h-10">
                  <SelectValue placeholder="Todos los equipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los equipos</SelectItem>
                  {equiposList.map(eq => (
                    <SelectItem key={eq.codigo} value={eq.codigo}>{eq.codigo} - {eq.nombre_equipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full md:w-40">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Desde
              </label>
              <Input type="date" className="bg-white h-10" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
            </div>

            <div className="space-y-2 w-full md:w-40">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Hasta
              </label>
              <Input type="date" className="bg-white h-10" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
            </div>

            <Button variant="outline" className="h-10 gap-2 text-primary border-primary/20 hover:bg-primary/5">
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. TABLA DE AUDITORÍA */}
      <Card className="shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Auditoría de Partes
            </CardTitle>
            <CardDescription>Registro histórico de actividad operativa.</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono">
            {partes.length} Registros
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold">Fecha</TableHead>
                <TableHead className="font-bold">N° Parte</TableHead>
                <TableHead className="font-bold">Equipo</TableHead>
                <TableHead className="font-bold">Ubicación / Obra</TableHead>
                <TableHead className="font-bold text-center">Horas</TableHead>
                <TableHead className="font-bold text-center">Consumo</TableHead>
                <TableHead className="font-bold">Usuario</TableHead>
                <TableHead className="text-right font-bold pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="h-32 text-center">Cargando datos...</TableCell></TableRow>
              ) : partes.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">No hay partes registrados en este período.</TableCell></TableRow>
              ) : (
                partes.map((p) => (
                  <TableRow key={p.nro_parte} className="hover:bg-muted/20 text-sm">
                    <TableCell className="whitespace-nowrap font-medium text-muted-foreground">
                      {new Date(p.fecha_parte).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-primary">#{p.nro_parte}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{p.equipo_codigo}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{p.equipo.marca}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]" title={p.obra_ubicacion}>
                        <HardHat className="h-3.5 w-3.5 text-orange-500/70" /> {p.obra_ubicacion}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono bg-slate-50 border-slate-200">
                        {p.horas_trabajadas.toFixed(1)} hs
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {p.combustible_litros > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600">
                          <Droplets className="h-3 w-3" /> {p.combustible_litros} L
                        </div>
                      ) : <span className="text-muted-foreground/30">-</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      ID: {p.usuario.id_usuario}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {p.observaciones ? (
                        <div className="flex justify-end group relative">
                          <AlertCircle className="h-4 w-4 text-amber-500 cursor-help" />
                          {/* Tooltip simple nativo */}
                          <span className="absolute right-0 top-6 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg border z-50 hidden group-hover:block">
                            {p.observaciones}
                          </span>
                        </div>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500/30 ml-auto" />
                      )}
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