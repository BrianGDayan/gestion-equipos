import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Usamos transaction para ejecutar todas las consultas en paralelo (mayor velocidad)
    const [
      totalEquipos,
      equiposEnObra,
      equiposEnTaller,
      stockCritico,
      actividadReciente
    ] = await prisma.$transaction([
      
      // 1. Total de Equipos
      prisma.equipo.count(),

      // 2. Equipos Operativos (Los que tienen ubicación y NO están en depósito/taller/baja)
      prisma.equipo.count({
        where: {
          AND: [
            { ubicacion_actual: { not: null } },
            { ubicacion_actual: { notIn: ['DEPOSITO', 'TALLER', 'BAJA', 'Baja', 'Deposito'] } }
          ]
        }
      }),

      // 3. Equipos en Taller
      prisma.equipo.count({
        where: { ubicacion_actual: { in: ['TALLER', 'MANTENIMIENTO'] } }
      }),

      // 4. Repuestos con Stock Crítico
      prisma.repuesto.count({
        where: { stock_actual: { lte: prisma.repuesto.fields.stock_minimo } }
      }),

      // 5. Últimos 5 Partes Diarios (Actividad)
      prisma.parteDiario.findMany({
        take: 5,
        orderBy: { fecha_carga: 'desc' },
        include: {
          equipo: { select: { nombre_equipo: true, marca: true } },
          usuario: { select: { rol: true } } // O nombre si lo agregaste
        }
      })
    ]);

    // Serializamos los BigInt a String para evitar errores de JSON
    const actividadSerializada = actividadReciente.map(p => ({
      ...p,
      nro_parte: p.nro_parte.toString(),
      // Aseguramos que los decimales sean números
      horas_trabajadas: Number(p.horas_trabajadas)
    }));

    return NextResponse.json({
      kpis: {
        total: totalEquipos,
        operativos: equiposEnObra,
        taller: equiposEnTaller,
        stock_bajo: stockCritico
      },
      actividad: actividadSerializada
    });

  } catch (error) {
    console.error("Error Dashboard API:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}