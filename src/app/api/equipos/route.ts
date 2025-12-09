import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/equipos
export async function GET() {
  try {
    const equipos = await prisma.equipo.findMany({
      select: {
        codigo: true,
        nombre_equipo: true,
        ubicacion_actual: true,
        tipo_codigo: true
      }
    })
    return NextResponse.json(equipos)
  } catch (error) {
    console.error('Error fetching equipos:', error)
    return NextResponse.json({ message: "Error al obtener equipos" }, { status: 500 })
  }
}

// POST /api/equipos
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { codigo, nombre_equipo, ubicacion_actual, tipo_codigo } = data

    const nuevoEquipo = await prisma.equipo.create({
      data: {
        codigo: codigo,
        nombre_equipo: nombre_equipo,
        ubicacion_actual: ubicacion_actual,
        tipo_codigo: tipo_codigo, // <-- Campo requerido agregado
      },
    })

    await prisma.trazabilidadUbicacion.create({
        data: {
            equipo_codigo: nuevoEquipo.codigo,
            ubicacion: ubicacion_actual,
        },
    });

    return NextResponse.json(nuevoEquipo, { status: 201 })
  } catch (error) {
    console.error('Error al crear equipo:', error)
    return NextResponse.json({ message: "Error al crear equipo" }, { status: 500 })
  }
}