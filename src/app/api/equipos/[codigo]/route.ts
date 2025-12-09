"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: { codigo: string } }
) {
  const { codigo } = context.params;
  const data = await request.json();
  const nuevaUbicacion = data.ubicacion_actual;

  if (!nuevaUbicacion) {
    return NextResponse.json({ message: "La nueva ubicación es requerida." }, { status: 400 });
  }

  try {
    const [equipoActualizado] = await prisma.$transaction([
      prisma.equipo.update({
        where: { codigo },
        data: { ubicacion_actual: nuevaUbicacion },
      }),
      prisma.trazabilidadUbicacion.create({
        data: {
          equipo_codigo: codigo,
          ubicacion: nuevaUbicacion,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Ubicación actualizada y registrada con éxito.",
      equipo: equipoActualizado,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: `Equipo con código ${codigo} no encontrado.` },
        { status: 404 }
      );
    }

    console.error("Error al modificar ubicación:", error);
    return NextResponse.json({ message: "Error interno al modificar la ubicación" }, { status: 500 });
  }
}
