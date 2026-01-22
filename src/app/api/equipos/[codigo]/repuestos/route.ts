import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST: Vincular un repuesto existente al equipo
export async function POST(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  
  try {
    const { repuestoId } = await request.json();

    if (!repuestoId) {
      return NextResponse.json({ message: "ID de repuesto requerido" }, { status: 400 });
    }

    // Usamos 'connect' para relacionar registros existentes
    const equipoActualizado = await prisma.equipo.update({
      where: { codigo },
      data: {
        repuestos: {
          connect: { id: Number(repuestoId) }
        }
      },
      include: { repuestos: true } // Devolvemos la lista actualizada
    });

    return NextResponse.json(equipoActualizado.repuestos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al vincular repuesto" }, { status: 500 });
  }
}

// DELETE: Desvincular (Quitar de la lista de compatibles, NO borrar el repuesto)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  
  try {
    const { repuestoId } = await request.json();

    const equipoActualizado = await prisma.equipo.update({
      where: { codigo },
      data: {
        repuestos: {
          disconnect: { id: Number(repuestoId) }
        }
      },
      include: { repuestos: true }
    });

    return NextResponse.json(equipoActualizado.repuestos);
  } catch (error) {
    return NextResponse.json({ message: "Error al desvincular" }, { status: 500 });
  }
}