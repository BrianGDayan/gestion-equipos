export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { codigo: string } }
) {
  try {
    const historial = await prisma.trazabilidadUbicacion.findMany({
      where: { equipo_codigo: params.codigo },
      orderBy: { fecha_registro: "desc" },
    });

    // Convertir fechas a string si fuera necesario (evita errores de serialización)
    const safe = historial.map((h) => ({
      ...h,
      fecha_registro: h.fecha_registro.toISOString(),
    }));

    return NextResponse.json(safe);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json(
      { message: "Error al obtener historial" },
      { status: 500 }
    );
  }
}
