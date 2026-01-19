"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  LogOut,
  Hammer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Panel General", href: "/", icon: LayoutDashboard },
  { name: "Equipos", href: "/equipos", icon: Truck },
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
    // CAMBIO IMPORTANTE:
    // - 'top-20': Empieza 80px (h-20) abajo para no tapar el Header.
    // - 'h-[calc(100vh-5rem)]': Altura restante exacta.
    // - 'z-40': Un nivel abajo del Header (z-50).
    <aside 
      className="fixed left-0 top-20 bottom-0 w-64 z-40 text-white transition-all duration-300 shadow-xl overflow-y-auto" 
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      <div className="flex h-full flex-col py-4">
        
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-white shadow-glow" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {/* Indicador activo lateral (detalle estético extra) */}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-400 rounded-r-full" />}
                
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
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