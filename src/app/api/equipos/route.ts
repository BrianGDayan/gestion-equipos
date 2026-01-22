import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const categoria = searchParams.get("categoria");
  const tipo = searchParams.get("tipo");
  const search = searchParams.get("search");

  try {
    const equipos = await prisma.equipo.findMany({
      where: {
        ...(categoria && categoria !== "TODAS" ? { categoria: categoria as any } : {}),
        ...(tipo && tipo !== "TODOS" ? { tipo_codigo: tipo } : {}),
        ...(search ? {
          OR: [
            { nombre_equipo: { contains: search, mode: 'insensitive' } },
            { codigo: { contains: search, mode: 'insensitive' } },
            { marca: { contains: search, mode: 'insensitive' } },
          ]
        } : {}),
      },
      include: {
        tipo: true, 
      },
      orderBy: [
        { tipo_codigo: 'asc' },
        { codigo: 'asc' }
      ]
    });

    return NextResponse.json(equipos);
  } catch (error) {
    console.error("Error fetching equipos:", error);
    return NextResponse.json({ message: "Error al obtener equipos" }, { status: 500 });
  }
}