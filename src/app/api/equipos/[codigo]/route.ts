import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// GET: Obtiene el detalle completo para la Ficha Técnica (Fase 2)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;

  try {
    const equipo = await prisma.equipo.findUnique({
      where: { codigo },
      include: {
        tipo: true,
        repuestos: true,
        historial: {
          orderBy: { fecha_registro: 'desc' },
          take: 10 // Últimos 10 movimientos de ubicación
        },
        partes_diarios: {
          orderBy: { fecha_parte: 'desc' },
          take: 5 // Últimos 5 reportes de uso
        }
      }
    });

    if (!equipo) {
      return NextResponse.json({ message: "Equipo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(equipo);
  } catch (error: any) {
    console.error("Error al obtener detalle:", error);
    return NextResponse.json({ message: "Error al obtener detalle" }, { status: 500 });
  }
}

// PATCH: Actualiza la ubicación y registra en trazabilidad (Tu lógica original)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params; 

  const data = await request.json();
  const nuevaUbicacion = data.ubicacion_actual;

  if (!nuevaUbicacion) {
    return NextResponse.json(
      { message: "La nueva ubicación es requerida." },
      { status: 400 }
    );
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
    return NextResponse.json(
      { message: "Error interno al modificar la ubicación" },
      { status: 500 }
    );
  }
}

// DELETE: Elimina el equipo (Tu lógica original)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;

  try {
    await prisma.equipo.delete({
      where: { codigo },
    });

    return NextResponse.json({ message: "Equipo eliminado correctamente" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Equipo no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Error al eliminar el equipo" },
      { status: 500 }
    );
  }
}