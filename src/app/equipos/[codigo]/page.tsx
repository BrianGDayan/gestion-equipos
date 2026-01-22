'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Truck, Gauge, MapPin, Calendar, 
  FileText, Settings, History, Wrench, Info, CheckCircle2,
  Clock, HardHat, Droplets, Link2, Link2Off, Search, PlusCircle, AlertTriangle, Settings2
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// UI Shadcn
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DetalleEquipo() {
  const { codigo } = useParams();
  const router = useRouter();
  const [equipo, setEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRepuestoModalOpen, setIsRepuestoModalOpen] = useState(false);
  const [todosLosRepuestos, setTodosLosRepuestos] = useState<any[]>([]);
  const [filtroRepuesto, setFiltroRepuesto] = useState("");

  const abrirModalRepuestos = async () => {
    setIsRepuestoModalOpen(true);
    if (todosLosRepuestos.length === 0) {
      const res = await fetch('/api/repuestos');
      const data = await res.json();
      setTodosLosRepuestos(data);
    }
  };

  const vincularRepuesto = async (repuestoId: number) => {
    try {
      const res = await fetch(`/api/equipos/${codigo}/repuestos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repuestoId })
      });
      if (!res.ok) throw new Error("Error al vincular");
      
      const nuevosRepuestos = await res.json();
      // Actualizamos el estado local del equipo con la nueva lista
      setEquipo({ ...equipo, repuestos: nuevosRepuestos });
      toast.success("Repuesto vinculado");
      setIsRepuestoModalOpen(false);
    } catch (err) {
      toast.error("No se pudo vincular");
    }
  };

  const desvincularRepuesto = async (repuestoId: number) => {
    if(!confirm("¿Quitar este repuesto de la lista de compatibles?")) return;
    try {
      const res = await fetch(`/api/equipos/${codigo}/repuestos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repuestoId })
      });
      if (!res.ok) throw new Error("Error al desvincular");
      
      const nuevosRepuestos = await res.json();
      setEquipo({ ...equipo, repuestos: nuevosRepuestos });
      toast.success("Repuesto desvinculado");
    } catch (err) {
      toast.error("Error al eliminar relación");
    }
  };

  // Filtrado para el modal
  const repuestosFiltrados = todosLosRepuestos.filter(r => 
    !equipo.repuestos?.some((asignado: any) => asignado.id === r.id) && // Excluir los ya asignados
    (r.nombre.toLowerCase().includes(filtroRepuesto.toLowerCase()) || 
     r.codigo.toLowerCase().includes(filtroRepuesto.toLowerCase()))
  );

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`/api/equipos/${codigo}`);
        if (!res.ok) throw new Error("Equipo no encontrado");
        const data = await res.json();
        setEquipo(data);
      } catch (err) {
        toast.error("Error al cargar el detalle");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [codigo, router]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Gauge className="animate-spin h-10 w-10 text-primary" />
      <p className="text-muted-foreground animate-pulse">Cargando ficha técnica...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 1. HEADER DE NAVEGACIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight">{equipo.codigo}</h1>
              <Badge className="bg-primary uppercase">{equipo.categoria?.replace('_', ' ')}</Badge>
              <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> {equipo.estado}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium">{equipo.nombre_equipo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Settings className="h-4 w-4" /> Editar</Button>
          <Button className="gap-2 bg-primary"><Wrench className="h-4 w-4" /> Mantenimiento</Button>
        </div>
      </div>

      {/* 2. MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-white shadow-lg border-none overflow-hidden relative">
          <CardContent className="pt-6">
            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">Horómetro Actual</p>
            <h3 className="text-4xl font-black mt-1">{Number(equipo.horometro_actual).toFixed(1)} <span className="text-lg font-normal opacity-80">hs</span></h3>
            <Gauge className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10" />
          </CardContent>
        </Card>
        <Card className="shadow-md border-border/50">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Ubicación Actual</p>
            <h3 className="text-xl font-bold flex items-center gap-2 mt-1">
              <MapPin className="h-5 w-5 text-primary" /> {equipo.ubicacion_actual || 'Sin asignar'}
            </h3>
          </CardContent>
        </Card>
        <Card className="shadow-md border-border/50">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Referencia Técnica</p>
            <h3 className="text-xl font-bold flex items-center gap-2 mt-1">
              <Truck className="h-5 w-5 text-primary" /> {equipo.tipo?.referencia}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* 3. PESTAÑAS DE DETALLE */}
      <Tabs defaultValue="especificaciones" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 h-12">
          <TabsTrigger value="especificaciones" className="font-bold">Especificaciones</TabsTrigger>
          <TabsTrigger value="repuestos" className="font-bold">Repuestos</TabsTrigger>
          <TabsTrigger value="historial" className="font-bold">Trazabilidad</TabsTrigger>
          <TabsTrigger value="partes" className="font-bold">Partes Diarios</TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA: ESPECIFICACIONES --- */}
        <TabsContent value="especificaciones" className="mt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Ficha Técnica</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="space-y-3">
                {[
                  { label: "Marca", value: equipo.marca },
                  { label: "Modelo", value: equipo.modelo },
                  { label: "Año Fab.", value: equipo.anio },
                  { label: "Factura", value: equipo.factura },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-muted/50">
                    <span className="text-muted-foreground text-sm">{item.label}:</span>
                    <span className="font-bold">{item.value || '-'}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: "N° Serie", value: equipo.numero_serie },
                  { label: "N° Chasis", value: equipo.numero_chasis },
                  { label: "Dominio", value: equipo.dominio },
                  { label: "Tipo Cód.", value: equipo.tipo_codigo },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-muted/50">
                    <span className="text-muted-foreground text-sm">{item.label}:</span>
                    <span className="font-bold">{item.value || '-'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA: REPUESTOS (GESTIÓN DE VINCULACIÓN) --- */}
        <TabsContent value="repuestos" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Repuestos Compatibles</CardTitle>
                <p className="text-sm text-muted-foreground">Gestión de insumos asignados a este equipo.</p>
              </div>
              
              {/* MODAL DE BÚSQUEDA Y VINCULACIÓN */}
              <Dialog open={isRepuestoModalOpen} onOpenChange={setIsRepuestoModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={abrirModalRepuestos} size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                    <Link2 className="h-4 w-4" /> Vincular Repuesto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Buscar Repuesto en Pañol</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar por código, nombre o marca..." 
                        className="pl-9"
                        value={filtroRepuesto}
                        onChange={(e) => setFiltroRepuesto(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    {/* LISTA DE RESULTADOS DEL BUSCADOR */}
                    <div className="border rounded-md h-[300px] overflow-y-auto bg-slate-50/50">
                      {repuestosFiltrados.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                          <Search className="h-8 w-8 opacity-20" />
                          <p>No se encontraron repuestos disponibles.</p>
                        </div>
                      ) : (
                        repuestosFiltrados.map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-white transition-colors">
                            <div>
                              <p className="font-bold text-sm text-primary">{r.nombre}</p>
                              <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="bg-slate-200 px-1.5 rounded text-slate-700 font-mono">{r.codigo}</span>
                                <span>| {r.marca}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="secondary" className="h-8" onClick={() => vincularRepuesto(r.id)}>
                              <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Vincular
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {/* TABLA DE REPUESTOS VINCULADOS */}
              {equipo.repuestos && equipo.repuestos.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="w-[100px]">Código</TableHead>
                        <TableHead>Repuesto</TableHead>
                        <TableHead>Marca / Ref.</TableHead>
                        <TableHead className="text-center">Stock Pañol</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipo.repuestos.map((r: any) => {
                        const isLowStock = r.stock_actual <= r.stock_minimo;
                        return (
                          <TableRow key={r.id} className="hover:bg-muted/10">
                            <TableCell className="font-mono text-xs font-medium">{r.codigo}</TableCell>
                            <TableCell className="font-medium text-primary">{r.nombre}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {r.marca} {r.modelo}
                            </TableCell>
                            <TableCell className="text-center">
                              {isLowStock ? (
                                <Badge variant="destructive" className="gap-1 shadow-sm">
                                  {r.stock_actual} <AlertTriangle className="h-3 w-3" />
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 shadow-sm">
                                  {r.stock_actual} unid.
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                onClick={() => desvincularRepuesto(r.id)}
                                title="Desvincular del equipo"
                              >
                                <Link2Off className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <Settings2 className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="font-medium">No hay repuestos asociados.</p>
                  <p className="text-xs text-slate-400 max-w-xs text-center mt-1">
                    Vincule los filtros, correas y piezas clave para facilitar el mantenimiento futuro.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA: HISTORIAL DE UBICACIONES --- */}
        <TabsContent value="historial" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Trazabilidad de Movimientos</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Fecha de Registro</TableHead>
                    <TableHead className="font-bold">Ubicación Destino</TableHead>
                    <TableHead className="text-right font-bold pr-6">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipo.historial?.map((h: any) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">
                        {new Date(h.fecha_registro).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary/70" /> {h.ubicacion}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="outline" className="text-[10px] uppercase">Registrado</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!equipo.historial || equipo.historial.length === 0) && (
                    <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground italic">Sin movimientos registrados.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA: PARTES DIARIOS --- */}
        <TabsContent value="partes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-primary">Reportes de Uso Diarios</CardTitle>
              <Button size="sm" variant="outline" className="text-xs h-8">Ver todos</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">N° Parte</TableHead>
                    <TableHead className="font-bold">Fecha Parte</TableHead>
                    <TableHead className="font-bold">Horas Trabajadas</TableHead>
                    <TableHead className="font-bold">Obra / Ubicación</TableHead>
                    <TableHead className="text-right font-bold pr-6">Insumos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipo.partes_diarios?.map((p: any) => (
                    <TableRow key={p.nro_parte.toString()} className="group">
                      <TableCell className="font-bold text-primary">#{p.nro_parte.toString()}</TableCell>
                      <TableCell className="font-medium">
                        {new Date(p.fecha_parte).toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold">{Number(p.horas_trabajadas).toFixed(1)} hs</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <HardHat className="h-4 w-4 text-orange-500/70" /> {p.obra_ubicacion}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-3 text-xs text-muted-foreground">
                          {p.combustible_litros > 0 && <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {p.combustible_litros}L</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!equipo.partes_diarios || equipo.partes_diarios.length === 0) && (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No hay partes registrados para este equipo.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}