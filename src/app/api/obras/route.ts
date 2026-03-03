import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const obras = await prisma.obra.findMany({
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(obras);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre } = await request.json();
    const obra = await prisma.obra.create({
      data: { nombre: nombre.toUpperCase() }
    });
    return NextResponse.json(obra, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error al crear" }, { status: 500 });
  }
}