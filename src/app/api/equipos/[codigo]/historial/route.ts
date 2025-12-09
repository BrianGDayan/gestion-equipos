"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;

  try {
    const historial = await prisma.trazabilidadUbicacion.findMany({
      where: { equipo_codigo: codigo },
      orderBy: { fecha_registro: "desc" },
    });

    return NextResponse.json(historial);
  } catch (err) {
    return NextResponse.json(
      { message: "Error al obtener historial" },
      { status: 500 }
    );
  }
}
