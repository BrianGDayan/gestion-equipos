"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader2 } from "lucide-react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  
  const isPublicPage = pathname === "/login";

  useEffect(() => {
    if (isPublicPage) {
      setAuthorized(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, isPublicPage, router]);

  if (isPublicPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Fijo Arriba */}
      <Header />
      
      {/* Sidebar Fijo a la Izquierda */}
      <Sidebar />
      
      <div className="pt-24 pl-64 transition-all duration-300">
        <main className="p-8 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}