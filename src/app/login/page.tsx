"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login, LoginDto } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const dto: LoginDto = { idUsuario: Number(usuario), clave };

    try {
      await login(dto);
      toast.success("Bienvenido", { description: "Acceso correcto al sistema." });
      router.push("/");
    } catch (err) {
      toast.error("Error de acceso", { description: "Credenciales inválidas." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24 px-4 bg-gray-100">
      <Card className="w-full max-w-lg shadow-xl border-0 animate-slide-up overflow-hidden">
        
        {/* Header Visual con Color Corporativo (Opcional, para dar más estilo) */}
        <div className="h-2 bg-primary w-full"></div>

        <CardHeader className="space-y-4 text-center pb-6 pt-10">
          {/* LOGO DE LA EMPRESA AQUÍ */}
          <div className="flex justify-center mb-4">
            <Image 
              src="/img/logo.png" 
              alt="Logo Empresa" 
              width={220} // Ajusta según tu logo real
              height={80} 
              className="h-auto w-auto object-contain"
              priority
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-muted-foreground">Ingrese sus credenciales para continuar</p>
          </div>
        </CardHeader>

        <CardContent className="pb-10 px-8">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="ID Usuario"
                  required
                  disabled={isLoading}
                  className="h-12 pl-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="Contraseña"
                  required
                  disabled={isLoading}
                  className="h-12 pl-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 text-lg font-bold shadow-md mt-4 transition-transform hover:scale-[1.01] bg-primary hover:bg-primary-dark"
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "INGRESAR"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}