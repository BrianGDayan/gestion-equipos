import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
});

export const metadata = {
  title: "Sistema de Gestión de Equipos",
  description: "Trazabilidad de equipos GECO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans bg-gray-bg text-gray-text min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}