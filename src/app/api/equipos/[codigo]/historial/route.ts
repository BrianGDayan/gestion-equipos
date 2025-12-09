import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { codigo: string } }
) {
  try {
    const historial = await prisma.trazabilidadUbicacion.findMany({
      where: { equipo_codigo: params.codigo },
      orderBy: { fecha_registro: "desc" }
    });

    return NextResponse.json(historial);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json(
      { message: "Error al obtener historial" },
      { status: 500 }
    );
  }
}
