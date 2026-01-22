import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Obtener lista de repuestos con alertas de stock
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  try {
    const repuestos = await prisma.repuesto.findMany({
      where: {
        ...(search ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { codigo: { contains: search, mode: 'insensitive' } },
            { marca: { contains: search, mode: 'insensitive' } },
            { modelo: { contains: search, mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return NextResponse.json(repuestos);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener repuestos" }, { status: 500 });
  }
}

// POST: Crear nuevo repuesto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codigo, nombre, marca, modelo, tipo, stock_actual, stock_minimo } = body;

    // Validación básica
    if (!codigo || !nombre) {
      return NextResponse.json({ message: "Código y Nombre son obligatorios" }, { status: 400 });
    }

    const nuevoRepuesto = await prisma.repuesto.create({
      data: {
        codigo,
        nombre,
        marca,
        modelo,
        tipo, // Ej: "FILTRO", "CORREA"
        stock_actual: Number(stock_actual || 0),
        stock_minimo: Number(stock_minimo || 1)
      }
    });

    return NextResponse.json(nuevoRepuesto, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Ya existe un repuesto con ese código." }, { status: 409 });
    }
    return NextResponse.json({ message: "Error al crear repuesto" }, { status: 500 });
  }
}