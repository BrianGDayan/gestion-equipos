import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const equipo = searchParams.get("equipo"); 
  const fechaDesde = searchParams.get("desde");
  const fechaHasta = searchParams.get("hasta");

  try {
    const partes = await prisma.parteDiario.findMany({
      where: {
        ...(equipo && equipo !== "TODOS" ? { equipo_codigo: equipo } : {}),
        ...(fechaDesde || fechaHasta ? {
          fecha_parte: {
            ...(fechaDesde ? { gte: new Date(fechaDesde + "T00:00:00Z") } : {}),
            ...(fechaHasta ? { lte: new Date(fechaHasta + "T23:59:59Z") } : {}),
          }
        } : {})
      },
      include: {
        equipo: {
          select: { nombre_equipo: true, marca: true }
        },
        usuario: {
          select: { id_usuario: true } 
        }
      },
      orderBy: {
        fecha_parte: 'desc'
      },
      take: 100 
    });

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
    console.error("Error en GET /api/partes:", error);
    return NextResponse.json({ message: "Error al obtener partes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extraemos usando los nombres EXACTOS que envía tu frontend
    const { 
      nro_parte, 
      fecha_parte, 
      equipo_codigo, 
      id_usuario, 
      obra_ubicacion, 
      horometro_inicial, 
      horometro_final,
      combustible_litros, 
      aceite_motor_litros, 
      grasa_kg,
      observaciones 
    } = body;

    // 1. VALIDACIÓN: ¿El equipo está en una obra?
    const equipoActual = await prisma.equipo.findUnique({
      where: { codigo: equipo_codigo },
      select: { ubicacion_actual: true }
    });

    const ubicacionesProhibidas = ['DEPOSITO', 'TALLER', 'BAJA'];
    const ubicacionActualMayus = equipoActual?.ubicacion_actual?.toUpperCase() || '';
    
    if (!ubicacionActualMayus || ubicacionesProhibidas.includes(ubicacionActualMayus)) {
      return NextResponse.json({ 
        message: "Operación denegada. El equipo debe estar asignado a una obra para registrar un parte." 
      }, { status: 403 });
    }

    // Cálculos matemáticos limpios
    const inicial = parseFloat(horometro_inicial) || 0;
    const final = parseFloat(horometro_final) || 0;
    const horasTrabajadas = final - inicial;

    // 2. TRANSACCIÓN: Registro y actualización
    const nuevoParte = await prisma.$transaction(async (tx) => {
      
      // A) Crear el parte usando la sintaxis 'connect' para las relaciones
      const parte = await tx.parteDiario.create({
        data: {
          nro_parte: BigInt(nro_parte),
          fecha_parte: new Date(fecha_parte + "T12:00:00Z"), // Evita desfasaje horario
          obra_ubicacion,
          
          horometro_inicial: inicial,
          horometro_final: final,
          horas_trabajadas: horasTrabajadas,
          
          combustible: combustible_litros ? parseFloat(combustible_litros) : null,
          aceite_motor: aceite_motor_litros ? parseFloat(aceite_motor_litros) : null,
          grasa: grasa_kg ? parseFloat(grasa_kg) : null,
          observaciones: observaciones || null,

          // Conectar relaciones obligatorias
          equipo: { connect: { codigo: equipo_codigo } },
          usuario: { connect: { id_usuario: parseInt(id_usuario) || 1 } }
        }
      });

      // B) Actualizar el equipo
      await tx.equipo.update({
        where: { codigo: equipo_codigo },
        data: { 
          horometro_actual: final,
          ubicacion_actual: obra_ubicacion
        }
      });

      // C) Registrar en el historial de trazabilidad
      await tx.trazabilidadUbicacion.create({
        data: {
          ubicacion: obra_ubicacion,
          equipo: { connect: { codigo: equipo_codigo } }
        }
      });

      return parte;
    });

    // Convertimos BigInt a String para la respuesta JSON
    return NextResponse.json({ 
      message: "Parte registrado correctamente",
      nro_parte: nuevoParte.nro_parte.toString() 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error en POST /api/partes:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "El número de parte ya existe." }, { status: 409 });
    }
    
    return NextResponse.json({ message: "Error interno al registrar el parte." }, { status: 500 });
  }
}