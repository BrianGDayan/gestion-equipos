'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, AlertTriangle, 
  CheckCircle2, AlertCircle, Settings2, Save, Loader2 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function InventarioRepuestos() {
  const [repuestos, setRepuestos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para nuevo repuesto
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    codigo: '', nombre: '', marca: '', modelo: '', tipo: '', stock_actual: '0', stock_minimo: '2'
  });

  const cargarRepuestos = async () => {
    setIsLoading(true);
    try {
      const params = busqueda ? `?search=${busqueda}` : '';
      const res = await fetch(`/api/repuestos${params}`);
      const data = await res.json();
      setRepuestos(data);
    } catch (err) {
      toast.error("Error al cargar inventario");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce simple para búsqueda
    const timer = setTimeout(() => {
      cargarRepuestos();
    }, 500);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/repuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoRepuesto)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success("Repuesto agregado al inventario");
      setIsModalOpen(false);
      setNuevoRepuesto({ codigo: '', nombre: '', marca: '', modelo: '', tipo: '', stock_actual: '0', stock_minimo: '2' });
      cargarRepuestos();
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* HEADER Y ACCIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" /> Inventario de Repuestos
          </h1>
          <p className="text-muted-foreground">Gestión de stock, insumos y consumibles.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Alta de Nuevo Repuesto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCrear} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código (Único)</Label>
                  <Input required placeholder="Ej: FIL-001" value={nuevoRepuesto.codigo} onChange={e => setNuevoRepuesto({...nuevoRepuesto, codigo: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Input placeholder="Ej: FILTRO" value={nuevoRepuesto.tipo} onChange={e => setNuevoRepuesto({...nuevoRepuesto, tipo: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre / Descripción</Label>
                <Input required placeholder="Ej: Filtro de Aire Primario" value={nuevoRepuesto.nombre} onChange={e => setNuevoRepuesto({...nuevoRepuesto, nombre: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input placeholder="Ej: MANN" value={nuevoRepuesto.marca} onChange={e => setNuevoRepuesto({...nuevoRepuesto, marca: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Modelo / Referencia</Label>
                  <Input placeholder="Ej: C27902" value={nuevoRepuesto.modelo} onChange={e => setNuevoRepuesto({...nuevoRepuesto, modelo: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-md border">
                <div className="space-y-2">
                  <Label>Stock Inicial</Label>
                  <Input type="number" required value={nuevoRepuesto.stock_actual} onChange={e => setNuevoRepuesto({...nuevoRepuesto, stock_actual: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-orange-600">Stock Mínimo</Label>
                  <Input type="number" required value={nuevoRepuesto.stock_minimo} onChange={e => setNuevoRepuesto({...nuevoRepuesto, stock_minimo: e.target.value})} />
                </div>
              </div>
              <Button type="submit" disabled={isSaving} className="mt-2 w-full">
                {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar en Inventario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por código, nombre, marca o modelo..." 
              className="pl-10 h-10 bg-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLA DE STOCK */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[100px] font-bold">Código</TableHead>
                <TableHead className="font-bold">Descripción</TableHead>
                <TableHead className="font-bold">Marca / Modelo</TableHead>
                <TableHead className="font-bold">Tipo</TableHead>
                <TableHead className="text-center font-bold">Estado Stock</TableHead>
                <TableHead className="text-right font-bold pr-6">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : repuestos.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No se encontraron repuestos.</TableCell></TableRow>
              ) : (
                repuestos.map((r) => {
                  const isLowStock = r.stock_actual <= r.stock_minimo;
                  return (
                    <TableRow key={r.id} className="group hover:bg-muted/20">
                      <TableCell className="font-mono font-medium text-primary">{r.codigo}</TableCell>
                      <TableCell className="font-medium text-foreground">{r.nombre}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {r.marca} {r.modelo && <span className="text-xs ml-1 bg-slate-100 px-1 rounded">Ref: {r.modelo}</span>}
                      </TableCell>
                      <TableCell>
                        {r.tipo && <Badge variant="outline" className="text-[10px]">{r.tipo}</Badge>}
                      </TableCell>
                      <TableCell className="text-center">
                        {isLowStock ? (
                          <Badge variant="destructive" className="gap-1 animate-pulse">
                            <AlertCircle className="h-3 w-3" /> Reponer
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3" /> OK
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6 font-mono font-bold text-lg">
                        {r.stock_actual}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}