import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = {
  params: {
    codigo: string
  }
}

// GET /api/equipos/[codigo]/historial
export async function GET(request: Request, { params }: Params) {
  const { codigo } = params

  try {
    const historial = await prisma.trazabilidadUbicacion.findMany({
      where: {
        equipo_codigo: codigo,
      },
      orderBy: {
        fecha_registro: 'desc', // Muestra los más recientes primero
      },
    })

    return NextResponse.json(historial)
  } catch (error) {
    console.error('Error al obtener historial:', error)
    return NextResponse.json({ message: "Error al obtener historial" }, { status: 500 })
  }
}