import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idUsuario, clave } = body;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: Number(idUsuario) },
    });

    // Validar existencia y clave (lógica simple igual a tu referencia)
    if (!usuario || usuario.clave !== clave) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Generar Token
    const payload = {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '8h',
    });

    // Retornar datos + token
    return NextResponse.json({
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
      access_token: token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}