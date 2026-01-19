'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner"; // Usamos Sonner para notificaciones elegantes (como en la referencia)

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

interface Equipo {
  codigo: string;
  nombre_equipo: string;
  ubicacion_actual: string | null;
  tipo_codigo: string; 
}

interface EstadoEquipoNuevo {
  codigo: string; 
  nombre_equipo: string;
  ubicacion_actual: string;
}

export default function TablaEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el nuevo equipo
  const [equipoNuevo, setEquipoNuevo] = useState<EstadoEquipoNuevo>({
    codigo: '',
    nombre_equipo: '',
    ubicacion_actual: '',
  });

  // Estados de edición
  const [codigoEnEdicion, setCodigoEnEdicion] = useState<string | null>(null);
  const [ubicacionEditada, setUbicacionEditada] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filtro de búsqueda local (Mejora UX)
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const res = await fetch('/api/equipos');
      if (!res.ok) throw new Error('Error al cargar equipos');
      const data = await res.json();
      setEquipos(data);
    } catch (err: any) {
      toast.error("Error de conexión", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

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

  // Lógica de filtrado visual
  const equiposFiltrados = equipos.filter(eq => 
    eq.nombre_equipo.toLowerCase().includes(filtro.toLowerCase()) ||
    eq.codigo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card className="shadow-sm border-border animate-slide-up">
      <CardHeader className="pb-4 border-b border-border bg-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Inventario de Equipos
            </CardTitle>
            <CardDescription>
              Gestión de flota, maquinaria y herramientas.
            </CardDescription>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por código o nombre..." 
              className="pl-9 bg-white"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[15%]">Código</TableHead>
                <TableHead className="w-[35%]">Equipo / Nombre</TableHead>
                <TableHead className="w-[35%]">Ubicación Actual</TableHead>
                <TableHead className="w-[15%] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {/* --- Fila de Creación Rápida (Estilizada para resaltar) --- */}
              <TableRow className="bg-blue-50/40 hover:bg-blue-50/60 border-b border-blue-100">
                <TableCell className="p-3">
                  <Input 
                    placeholder="Ej: G8-01" 
                    value={equipoNuevo.codigo}
                    onChange={(e) => setEquipoNuevo({...equipoNuevo, codigo: e.target.value})}
                    className="h-9 bg-white border-blue-200 focus-visible:ring-blue-500"
                  />
                </TableCell>
                <TableCell className="p-3">
                  <Input 
                    placeholder="Nombre del equipo..." 
                    value={equipoNuevo.nombre_equipo}
                    onChange={(e) => setEquipoNuevo({...equipoNuevo, nombre_equipo: e.target.value})}
                    className="h-9 bg-white border-blue-200 focus-visible:ring-blue-500"
                  />
                </TableCell>
                <TableCell className="p-3">
                  <Input 
                    placeholder="Ubicación inicial..." 
                    value={equipoNuevo.ubicacion_actual}
                    onChange={(e) => setEquipoNuevo({...equipoNuevo, ubicacion_actual: e.target.value})}
                    className="h-9 bg-white border-blue-200 focus-visible:ring-blue-500"
                  />
                </TableCell>
                <TableCell className="p-3 text-right">
                  <Button 
                    size="sm" 
                    onClick={crearEquipo}
                    disabled={isSaving || !equipoNuevo.codigo || !equipoNuevo.nombre_equipo}
                    className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Agregar</>}
                  </Button>
                </TableCell>
              </TableRow>

              {/* --- Listado de Equipos --- */}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                      Cargando inventario...
                    </div>
                  </TableCell>
                </TableRow>
              ) : equiposFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                      No se encontraron equipos.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                equiposFiltrados.map((eq) => {
                  const enEdicion = codigoEnEdicion === eq.codigo;
                  
                  return (
                    <TableRow key={eq.codigo} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="font-mono text-xs bg-slate-50 text-slate-700">
                          {eq.codigo}
                        </Badge>
                        {/* Mostramos el tipo pequeño si se desea */}
                        <span className="ml-2 text-[10px] text-muted-foreground uppercase">{eq.tipo_codigo}</span>
                      </TableCell>
                      
                      <TableCell className="font-medium text-foreground">
                        {eq.nombre_equipo}
                      </TableCell>
                      
                      <TableCell>
                        {enEdicion ? (
                          <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                            <Input 
                              value={ubicacionEditada}
                              onChange={(e) => setUbicacionEditada(e.target.value)}
                              className="h-8"
                              autoFocus
                              placeholder="Nueva ubicación..."
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {eq.ubicacion_actual || <span className="italic opacity-50">Sin asignar</span>}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {enEdicion ? (
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => guardarUbicacion(eq.codigo)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={cancelarEdicion}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" 
                              onClick={() => iniciarEdicion(eq)}
                              title="Editar ubicación"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50" 
                              onClick={() => eliminarEquipo(eq.codigo)}
                              title="Eliminar equipo"
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
  );
}