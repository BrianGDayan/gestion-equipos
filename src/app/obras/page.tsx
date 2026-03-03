"use client";

import { useState, useEffect } from "react";
import { Hammer, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Obra {
  id: number;
  nombre: string;
  estado: string;
}

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const cargarObras = async () => {
    try {
      const res = await fetch("/api/obras");
      const data = await res.json();
      setObras(data);
    } catch (err) {
      toast.error("Error al cargar obras");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarObras();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
      });
      
      if (!res.ok) throw new Error();
      
      setNombre("");
      toast.success("Obra registrada");
      cargarObras();
    } catch (err) {
      toast.error("Error al registrar, puede que ya exista");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Hammer className="h-8 w-8 text-primary" /> Gestión de Obras
        </h1>
        <p className="text-muted-foreground">Administración de destinos y locaciones de trabajo.</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleCrear} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-slate-700">Nueva Obra / Locación</label>
              <Input 
                placeholder="Ej: MINERA EXAR" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-10 uppercase"
              />
            </div>
            <Button type="submit" disabled={isSaving || !nombre} className="h-10 bg-primary">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Agregar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Obras Registradas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-16 text-center">ID</TableHead>
                <TableHead>Nombre de la Obra</TableHead>
                <TableHead className="text-right pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : obras.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">No hay obras registradas</TableCell></TableRow>
              ) : (
                obras.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell className="text-center font-mono text-xs text-slate-400">{obra.id}</TableCell>
                    <TableCell className="font-bold">{obra.nombre}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {obra.estado}
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