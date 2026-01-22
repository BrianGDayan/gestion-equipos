"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  LogOut,
  Hammer,
  ClipboardCheck, 
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Panel General", href: "/", icon: LayoutDashboard },
  { name: "Equipos", href: "/equipos", icon: Truck },
  { name: "Partes Diarios", href: "/partes", icon: ClipboardCheck }, 
  { name: "Inventario", href: "/repuestos", icon: Package },
  { name: "Historial", href: "/historial", icon: MapPin },
  { name: "Obras", href: "/obras", icon: Hammer },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside 
      className="fixed left-0 top-20 bottom-0 w-64 z-40 text-white transition-all duration-300 shadow-xl overflow-y-auto" 
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      <div className="flex h-full flex-col py-4">
        
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  // CAMBIO: Agregamos 'border' aquí para que siempre tenga borde (aunque sea invisible)
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group relative border",
                  isActive
                    // Activo: Borde visible y fondo
                    ? "bg-white/10 text-white shadow-glow border-white/10" 
                    // Inactivo: Borde transparente (evita el salto visual)
                    : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-400 rounded-r-full" />}
                
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pt-4 mt-auto border-t border-white/10">
           <button 
             onClick={handleLogout}
             className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
           >
              <LogOut className="h-4 w-4" /> Cerrar Sesión
           </button>
        </div>
      </div>
    </aside>
  );
}