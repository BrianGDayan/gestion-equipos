import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const equipo = searchParams.get("equipo"); // Filtro opcional
  const fechaDesde = searchParams.get("desde");
  const fechaHasta = searchParams.get("hasta");

  try {
    const partes = await prisma.parteDiario.findMany({
      where: {
        ...(equipo && equipo !== "TODOS" ? { equipo_codigo: equipo } : {}),
        fecha_parte: {
          gte: fechaDesde ? new Date(fechaDesde) : undefined,
          lte: fechaHasta ? new Date(fechaHasta) : undefined,
        }
      },
      include: {
        equipo: {
          select: { nombre_equipo: true, marca: true }
        },
        usuario: {
          select: { id_usuario: true } // O nombre_completo si lo agregaste al modelo
        }
      },
      orderBy: {
        fecha_parte: 'desc'
      },
      take: 100 // Límite de seguridad para no saturar la tabla
    });

    // Serializamos BigInt a String para evitar error en JSON
    const partesSerializados = partes.map(p => ({
      ...p,
      nro_parte: p.nro_parte.toString(),
      horometro_inicial: Number(p.horometro_inicial),
      horometro_final: Number(p.horometro_final),
      horas_trabajadas: Number(p.horas_trabajadas),
      combustible_litros: Number(p.combustible),
      aceite_motor_litros: Number(p.aceite_motor),
      grasa_kg: Number(p.grasa)
    }));

    return NextResponse.json(partesSerializados);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al obtener partes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nro_parte, fecha_parte, equipo_codigo, id_usuario, 
      obra_ubicacion, horometro_inicial, horometro_final,
      combustible, aceite_motor, aceite_hidraulico, grasa,
      observaciones 
    } = body;

    // 1. VALIDACIÓN: ¿El equipo está en una obra?
    // Para esta lógica, consideramos 'Deposito' o null como ubicaciones no válidas para partes.
    const equipoActual = await prisma.equipo.findUnique({
      where: { codigo: equipo_codigo },
      select: { ubicacion_actual: true }
    });

    const ubicacionesProhibidas = ['DEPOSITO', 'TALLER', 'BAJA', null];
    if (ubicacionesProhibidas.includes(equipoActual?.ubicacion_actual?.toUpperCase() || null)) {
      return NextResponse.json({ 
        message: "Operación denegada. El equipo debe estar asignado a una obra para registrar un parte." 
      }, { status: 403 });
    }

    // 2. TRANSACCIÓN: Registro y actualización
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear el parte (Calculando horas_trabajadas)
      const horas = Number(horometro_final) - Number(horometro_inicial);
      
      const nuevoParte = await tx.parteDiario.create({
        data: {
          nro_parte: BigInt(nro_parte),
          fecha_parte: new Date(fecha_parte),
          equipo_codigo,
          id_usuario: Number(id_usuario),
          obra_ubicacion,
          horometro_inicial: Number(horometro_inicial),
          horometro_final: Number(horometro_final),
          horas_trabajadas: horas,
          combustible: Number(combustible || 0),
          aceite_motor: Number(aceite_motor || 0),
          aceite_hidraulico: Number(aceite_hidraulico || 0),
          grasa: Number(grasa || 0),
          observaciones
        }
      });

      // Actualizar el equipo (Horómetro y Ubicación)
      await tx.equipo.update({
        where: { codigo: equipo_codigo },
        data: { 
          horometro_actual: Number(horometro_final),
          ubicacion_actual: obra_ubicacion
        }
      });

      // Registrar en el historial de trazabilidad
      await tx.trazabilidadUbicacion.create({
        data: {
          equipo_codigo,
          ubicacion: obra_ubicacion,
        }
      });

      return nuevoParte;
    });

    // Convertimos BigInt a String para la respuesta
    return NextResponse.json({ 
      ...resultado, 
      nro_parte: resultado.nro_parte.toString() 
    }, { status: 201 });

  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "El número de parte ya existe." }, { status: 409 });
    }
    return NextResponse.json({ message: "Error al registrar el parte." }, { status: 500 });
  }
}