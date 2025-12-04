import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = {
  params: {
    codigo: string
  }
}

// PATCH /api/equipos/[codigo]
export async function PATCH(request: Request, { params }: Params) {
  const { codigo } = params
  const data = await request.json()
  const nuevaUbicacion = data.ubicacion_actual

  if (!nuevaUbicacion) {
    return NextResponse.json({ message: "La nueva ubicación es requerida." }, { status: 400 })
  }

  try {
    // Usamos una transacción para asegurar que la actualización y el registro de historial sean atómicos
    const [equipoActualizado, registroHistorial] = await prisma.$transaction([
      // 1. Actualizar la ubicación actual del Equipo
      prisma.equipo.update({
        where: { codigo: codigo },
        data: { ubicacion_actual: nuevaUbicacion },
      }),

      // 2. Crear un registro en la tabla de Historial
      prisma.trazabilidadUbicacion.create({
        data: {
          equipo_codigo: codigo,
          ubicacion: nuevaUbicacion,
        },
      }),
    ])

    return NextResponse.json({
      message: "Ubicación actualizada y registrada con éxito.",
      equipo: equipoActualizado,
    })

  } catch (error: any) {
    if (error.code === 'P2025') {
      // Código de error de Prisma para 'registro no encontrado' (Equipo no existe)
      return NextResponse.json({ message: `Equipo con código ${codigo} no encontrado.` }, { status: 404 })
    }
    console.error('Error al modificar ubicación:', error)
    return NextResponse.json({ message: "Error interno al modificar la ubicación" }, { status: 500 })
  }
}