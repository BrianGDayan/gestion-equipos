import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tipos = await prisma.tipo.findMany({
      orderBy: { codigo: 'asc' }
    });
    return NextResponse.json(tipos);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}