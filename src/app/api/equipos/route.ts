"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/equipos
export async function GET() {
  try {
    const equipos = await prisma.equipo.findMany({
      select: {
        codigo: true,
        nombre_equipo: true,
        ubicacion_actual: true,
        tipo_codigo: true
      },
      // Nuevo ordenamiento: primero por tipo_codigo, luego por codigo
      orderBy: [
        { tipo_codigo: 'asc' },
        { codigo: 'asc' }
      ]
    });

    return NextResponse.json(equipos);
  } catch (error: any) { // Usamos 'any' para evitar el error de tipo en el catch
    console.error("Error fetching equipos:", error);
    return NextResponse.json({ message: "Error al obtener equipos" }, { status: 500 });
  }
}

// POST /api/equipos
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { codigo, nombre_equipo, ubicacion_actual } = data;

    // 1. Lógica de extracción del tipo_codigo
    const partes = codigo.split('-');
    if (partes.length < 2) {
      return NextResponse.json({ message: "El código de equipo debe tener el formato TIPO-ID (ej: G8-01)" }, { status: 400 });
    }
    const tipo_codigo_extraido = partes[0].toUpperCase();

    // 2. Validación de existencia del Tipo en la BD
    const tipoExiste = await prisma.tipo.findUnique({
      where: { codigo: tipo_codigo_extraido },
    });

    if (!tipoExiste) {
       return NextResponse.json({ 
         message: `El código de tipo (${tipo_codigo_extraido}) no es válido o no existe en la tabla Tipo.`,
         details: "Verifique que la primera parte del código (antes del guion) esté en la tabla Tipo."
       }, { status: 400 });
    }

    // 3. Crear el nuevo equipo (usando el tipo extraído)
    const nuevoEquipo = await prisma.equipo.create({
      data: {
        codigo,
        nombre_equipo,
        ubicacion_actual,
        tipo_codigo: tipo_codigo_extraido, // Usamos el código validado
      },
    });

    // 4. Registrar la ubicación inicial en el historial
    await prisma.trazabilidadUbicacion.create({
      data: {
        equipo_codigo: nuevoEquipo.codigo,
        ubicacion: ubicacion_actual,
      },
    });

    return NextResponse.json(nuevoEquipo, { status: 201 });
  } catch (error: any) { // <-- Se define el tipo error como 'any'
    console.error("Error al crear equipo:", error);
    
    // Manejo de error de clave duplicada (Prisma P2002)
    if (error.code === 'P2002') {
        return NextResponse.json({ message: "El código de equipo ya existe." }, { status: 409 });
    }
    
    return NextResponse.json({ message: "Error al crear equipo" }, { status: 500 });
  }
}