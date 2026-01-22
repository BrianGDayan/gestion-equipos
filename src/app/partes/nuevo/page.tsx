'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { 
  ClipboardCheck, HardHat, Gauge, Droplets, 
  MessageSquare, Save, Loader2 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NuevoParte() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [equipos, setEquipos] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    nro_parte: '',
    fecha_parte: new Date().toISOString().split('T')[0],
    equipo_codigo: '',
    obra_ubicacion: '',
    horometro_inicial: '',
    horometro_final: '',
    combustible_litros: '',
    aceite_motor_litros: '',
    grasa_kg: '',
    observaciones: ''
  });

  useEffect(() => {
    fetch('/api/equipos').then(res => res.json()).then(data => setEquipos(data));
  }, []);

  // Manejador Genérico para Inputs y Textareas (Soluciona el error de TypeScript)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipoChange = (codigo: string) => {
    const eq = equipos.find(e => e.codigo === codigo);
    setFormData(prev => ({
      ...prev,
      equipo_codigo: codigo,
      // Si existe el equipo, autocompletamos con sus datos actuales
      horometro_inicial: eq?.horometro_actual ? String(eq.horometro_actual) : '0',
      obra_ubicacion: eq?.ubicacion_actual || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error("Sesión no válida");
      const user = JSON.parse(userStr);
      
      const res = await fetch('/api/partes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id_usuario: user.id_usuario })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success("Parte registrado correctamente");
      router.push('/');
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 animate-slide-up">
      <Card className="border-t-4 border-t-primary shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Nuevo Parte Diario</CardTitle>
          <CardDescription>Registro de actividad y consumo en obra</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Datos del Documento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nro_parte">N° de Parte</Label>
                <Input 
                  id="nro_parte" name="nro_parte"
                  type="number" required placeholder="0001"
                  value={formData.nro_parte}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_parte">Fecha</Label>
                <Input 
                  id="fecha_parte" name="fecha_parte"
                  type="date" required
                  value={formData.fecha_parte}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 2. Equipo y Ubicación */}
            <div className="space-y-2">
              <Label>Equipo</Label>
              <Select onValueChange={handleEquipoChange} required>
                <SelectTrigger className="h-12 text-lg bg-background">
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  {equipos.map(eq => (
                    <SelectItem key={eq.codigo} value={eq.codigo}>
                      {eq.codigo} - {eq.nombre_equipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obra_ubicacion" className="flex items-center gap-2">
                <HardHat className="h-4 w-4" /> Obra / Ubicación Actual
              </Label>
              <Input 
                id="obra_ubicacion" name="obra_ubicacion"
                required placeholder="Ej: Olaroz - Sales de Jujuy"
                value={formData.obra_ubicacion}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            {/* 3. Horómetros */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-2">
                <Label htmlFor="horometro_inicial" className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" /> Inicio (hs)
                </Label>
                <Input 
                  id="horometro_inicial" name="horometro_inicial"
                  type="number" step="0.1" required
                  value={formData.horometro_inicial}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horometro_final" className="flex items-center gap-2 text-primary">
                  <Gauge className="h-4 w-4" /> Fin (hs)
                </Label>
                <Input 
                  id="horometro_final" name="horometro_final"
                  type="number" step="0.1" required
                  value={formData.horometro_final}
                  onChange={handleChange}
                  className="bg-white border-primary/30 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* 4. Insumos */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="combustible_litros" className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" /> Gasoil (L)
                </Label>
                <Input 
                  id="combustible_litros" name="combustible_litros"
                  type="number" 
                  value={formData.combustible_litros} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aceite_motor_litros">Aceite (L)</Label>
                <Input 
                  id="aceite_motor_litros" name="aceite_motor_litros"
                  type="number" 
                  value={formData.aceite_motor_litros} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grasa_kg">Grasa (kg)</Label>
                <Input 
                  id="grasa_kg" name="grasa_kg"
                  type="number" 
                  value={formData.grasa_kg} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Observaciones
              </Label>
              <Textarea 
                id="observaciones" name="observaciones"
                placeholder="Estado de la máquina, fallas encontradas..."
                value={formData.observaciones}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-bold shadow-lg transition-transform hover:scale-[1.01]">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              REGISTRAR PARTE
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}