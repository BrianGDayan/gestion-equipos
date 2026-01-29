'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Loader2, 
  Save, 
  X, 
  Trash2, 
  Pencil, 
  Plus, 
  Truck, 
  MapPin, 
  Search,
  AlertTriangle,
  Filter,
  Settings2,
  Gauge,
  Eraser,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// Componentes UI de Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Equipo {
  codigo: string;
  nombre_equipo: string;
  ubicacion_actual: string | null;
  tipo_codigo: string;
  marca?: string;
  modelo?: string;
  horometro_actual?: number;
  tipo?: {
    referencia: string;
    categoria: string; 
  };
}

interface Tipo {
  codigo: string;
  referencia: string;
}

interface EstadoEquipoNuevo {
  codigo: string; 
  nombre_equipo: string;
  ubicacion_actual: string;
}

export default function TablaEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el nuevo equipo (Fila de creación rápida)
  const [equipoNuevo, setEquipoNuevo] = useState<EstadoEquipoNuevo>({
    codigo: '',
    nombre_equipo: '',
    ubicacion_actual: '',
  });

  // Estados de edición
  const [codigoEnEdicion, setCodigoEnEdicion] = useState<string | null>(null);
  const [ubicacionEditada, setUbicacionEditada] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ESTADOS DE FILTROS (Fase 2)
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODAS");
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");
  const [busqueda, setBusqueda] = useState("");

  // Función para cargar tipos (necesaria para el Select de Tipos)
  const cargarTipos = async () => {
    try {
      const res = await fetch('/api/tipos');
      if (res.ok) {
        const data = await res.json();
        setTipos(data);
      }
    } catch (err) {
      console.error("Error cargando tipos");
    }
  };

  const cargarEquipos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroCategoria !== "TODAS") params.append("categoria", filtroCategoria);
      if (filtroTipo !== "TODOS") params.append("tipo", filtroTipo);
      if (busqueda) params.append("search", busqueda);

      const res = await fetch(`/api/equipos?${params.toString()}`);
      if (!res.ok) throw new Error('Error al cargar equipos');
      const data = await res.json();
      setEquipos(data);
    } catch (err: any) {
      toast.error("Error de conexión", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [filtroCategoria, filtroTipo, busqueda]);

  useEffect(() => {
    cargarTipos();
    cargarEquipos();
  }, [cargarEquipos]);

  const crearEquipo = async () => {
    if (!equipoNuevo.codigo || !equipoNuevo.nombre_equipo) {
      toast.warning("Datos incompletos", { description: "El código y nombre son obligatorios." });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipoNuevo), 
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al crear');
      }
      
      const equipoCreado = await res.json();
      setEquipos([...equipos, equipoCreado]); 
      setEquipoNuevo({ codigo: '', nombre_equipo: '', ubicacion_actual: '' }); 
      toast.success("Equipo registrado", { description: `${equipoCreado.nombre_equipo} agregado correctamente.` });
    } catch (err: any) {
      toast.error("No se pudo crear", { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const iniciarEdicion = (equipo: Equipo) => {
    setCodigoEnEdicion(equipo.codigo);
    setUbicacionEditada(equipo.ubicacion_actual || '');
  };

  const cancelarEdicion = () => {
    setCodigoEnEdicion(null);
    setUbicacionEditada('');
  };

  const guardarUbicacion = async (codigo: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/equipos/${codigo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ubicacion_actual: ubicacionEditada }),
      });

      if (!res.ok) throw new Error('Error actualizando');

      setEquipos(prev => prev.map(eq => 
        eq.codigo === codigo ? { ...eq, ubicacion_actual: ubicacionEditada } : eq
      ));
      setCodigoEnEdicion(null);
      toast.success("Ubicación actualizada");
    } catch (err: any) {
      toast.error("Error al guardar", { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const eliminarEquipo = async (codigo: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este equipo? Se borrará el historial.')) return;

    try {
      const res = await fetch(`/api/equipos/${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');

      setEquipos(prev => prev.filter(eq => eq.codigo !== codigo));
      toast.success("Equipo eliminado");
    } catch (err: any) {
      toast.error("No se pudo eliminar", { description: err.message });
    }
  };

  const limpiarFiltros = () => {
    setFiltroCategoria("TODAS");
    setFiltroTipo("TODOS");
    setBusqueda("");
  };

  return (
    <div className="space-y-6">
      
      {/* --- BARRA DE FILTROS AVANZADOS (Fase 2) --- */}
      <Card className="border-border/60 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* 1. Categoría */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" /> Categoría
              </label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="bg-white h-10">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODAS">Todas</SelectItem>
                  <SelectItem value="MOTORIZADO">Motorizado</SelectItem>
                  <SelectItem value="NO_MOTORIZADO">No Motorizado</SelectItem>
                  <SelectItem value="TRANSPORTE">Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Tipo */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" /> Tipo
              </label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="bg-white h-10">
                  <SelectValue placeholder="Seleccionar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los tipos</SelectItem>
                  {tipos.map((t) => (
                    <SelectItem key={t.codigo} value={t.codigo}>
                      {t.codigo} - {t.referencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Buscador */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Search className="h-3.5 w-3.5" /> Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Código, nombre o marca..." 
                  className="pl-10 bg-white h-10"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              className="h-10 border-dashed hover:bg-muted" 
              onClick={limpiarFiltros}
            >
              <Eraser className="h-4 w-4 mr-2" /> Reiniciar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- TABLA DE EQUIPOS --- */}
      <Card className="shadow-sm border-border animate-slide-up">
        <CardHeader className="pb-4 border-b border-border bg-muted/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Inventario de Equipos
              </CardTitle>
              <CardDescription>
                Gestión técnica y trazabilidad de flota.
              </CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
              {equipos.length} Equipos encontrados
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[12%] font-bold">Código</TableHead>
                  <TableHead className="w-[28%] font-bold">Equipo / Detalles</TableHead>
                  <TableHead className="w-[15%] font-bold">Categoría</TableHead>
                  <TableHead className="w-[15%] font-bold">Horómetro</TableHead>
                  <TableHead className="w-[15%] font-bold">Ubicación</TableHead>
                  <TableHead className="w-[15%] text-right font-bold pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {/* --- FILA DE CREACIÓN RÁPIDA (TU LÓGICA) --- */}
                <TableRow className="bg-blue-50/40 hover:bg-blue-50/60 border-b border-blue-100">
                  <TableCell className="p-3">
                    <Input 
                      placeholder="G8-01" 
                      value={equipoNuevo.codigo}
                      onChange={(e) => setEquipoNuevo({...equipoNuevo, codigo: e.target.value})}
                      className="h-9 bg-white border-blue-200"
                    />
                  </TableCell>
                  <TableCell className="p-3">
                    <Input 
                      placeholder="Nombre..." 
                      value={equipoNuevo.nombre_equipo}
                      onChange={(e) => setEquipoNuevo({...equipoNuevo, nombre_equipo: e.target.value})}
                      className="h-9 bg-white border-blue-200"
                    />
                  </TableCell>
                  <TableCell colSpan={2} className="p-3 text-muted-foreground text-xs italic">
                    Campos técnicos se editan en la ficha del equipo.
                  </TableCell>
                  <TableCell className="p-3 text-right" colSpan={2}>
                    <Button 
                      size="sm" 
                      onClick={crearEquipo}
                      disabled={isSaving || !equipoNuevo.codigo || !equipoNuevo.nombre_equipo}
                      className="bg-primary hover:bg-primary/90 text-white shadow-sm pr-6 pl-6"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> AGREGAR</>}
                    </Button>
                  </TableCell>
                </TableRow>

                {/* --- LISTADO DE EQUIPOS --- */}
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        Cargando inventario...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : equipos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                        No se encontraron equipos con esos filtros.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  equipos.map((eq) => {
                    const enEdicion = codigoEnEdicion === eq.codigo;
                    
                    return (
                      <TableRow key={eq.codigo} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="py-4 font-medium">
                          <Badge variant="outline" className="font-mono text-primary bg-primary/5 border-primary/10">
                            {eq.codigo}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{eq.nombre_equipo}</span>
                            <span className="text-[11px] text-muted-foreground uppercase tracking-tight">
                              {eq.marca ? `${eq.marca} ${eq.modelo || ''}` : eq.tipo?.referencia}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {eq.tipo?.categoria && (
                            <Badge className={
                              eq.tipo.categoria === 'MOTORIZADO' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                              eq.tipo.categoria === 'TRANSPORTE' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 
                              'bg-slate-100 text-slate-700'
                            }>
                              {eq.tipo.categoria.replace('_', ' ')}
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            <Gauge className="h-4 w-4 text-muted-foreground" />
                            {eq.horometro_actual ? `${Number(eq.horometro_actual).toFixed(1)} hs` : '0.0 hs'}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {enEdicion ? (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                              <Input 
                                value={ubicacionEditada}
                                onChange={(e) => setUbicacionEditada(e.target.value)}
                                className="h-8 border-primary"
                                autoFocus
                                placeholder="Ubicación..."
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 text-primary/60" />
                              {eq.ubicacion_actual || <span className="italic opacity-50">Sin asignar</span>}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="text-right pr-6">
                          {enEdicion ? (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => guardarUbicacion(eq.codigo)}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={cancelarEdicion}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end items-center gap-1">
                              {/* Botón de Ficha Técnica (Para Fase 2.5) */}
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                              
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" 
                                onClick={() => iniciarEdicion(eq)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" 
                                onClick={() => eliminarEquipo(eq.codigo)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}