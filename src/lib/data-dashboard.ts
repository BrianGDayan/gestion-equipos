import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  // Ejecutamos consultas en paralelo directamente en el servidor
  const [
    totalEquipos,
    equiposOperativos,
    equiposTaller,
    stockCritico,
    actividadReciente
  ] = await prisma.$transaction([
    prisma.equipo.count(),
    prisma.equipo.count({
      where: {
        AND: [
          { ubicacion_actual: { not: null } },
          { ubicacion_actual: { notIn: ['DEPOSITO', 'TALLER', 'BAJA'] } }
        ]
      }
    }),
    prisma.equipo.count({
      where: { ubicacion_actual: { in: ['TALLER', 'MANTENIMIENTO'] } }
    }),
    prisma.repuesto.count({
      where: { stock_actual: { lte: prisma.repuesto.fields.stock_minimo } }
    }),
    prisma.parteDiario.findMany({
      take: 5,
      orderBy: { fecha_carga: 'desc' },
      include: {
        equipo: { select: { nombre_equipo: true, marca: true } }
      }
    })
  ]);

  return {
    kpis: {
      total: totalEquipos,
      operativos: equiposOperativos,
      taller: equiposTaller,
      stock_bajo: stockCritico
    },
    actividad: actividadReciente
  };
}