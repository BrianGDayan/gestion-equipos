import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const equipo = searchParams.get("equipo");

  try {
    const historial = await prisma.trazabilidadUbicacion.findMany({
      where: {
        // Si mandan un código específico, filtramos, si no, traemos todo
        ...(equipo && equipo !== "TODOS" ? { equipo_codigo: equipo } : {}),
      },
      include: {
        // Traemos SOLO los datos del equipo (eliminamos el include de 'usuario')
        equipo: { 
          select: { 
            nombre_equipo: true, 
            marca: true, 
            tipo: { select: { referencia: true } } 
          } 
        }
      },
      orderBy: { fecha_registro: 'desc' },
      take: 200 // Límite para no saturar la BD de golpe
    });

    return NextResponse.json(historial);
  } catch (error) {
    console.error("Error cargando historial:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}