import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // TIPOS
  const tipos = [
    { codigo: 'G1', referencia: 'CAMIONES' },
    { codigo: 'G2', referencia: 'CAMIONETAS' },
    { codigo: 'G3', referencia: 'RETROPALAS' },
    { codigo: 'G4', referencia: 'CARGADORAS FRONTALES' },
    { codigo: 'G5', referencia: 'AUTOELEVADORES' },
    { codigo: 'G6', referencia: 'EXCAVADORAS' },
    { codigo: 'G7', referencia: 'MINI CARGADORAS' },
    { codigo: 'C7', referencia: 'COMPLEMENTOS MINICARGADORAS' },
    { codigo: 'G8', referencia: 'CARROS' },
    { codigo: 'G9', referencia: 'CARRETONES' },
    { codigo: 'G10', referencia: 'BATEAS' },
    { codigo: 'G11', referencia: 'SEMIRREMOLQUES' },
    { codigo: 'G12', referencia: 'PANCHERAS' },
    { codigo: 'G13', referencia: 'TANQUES DE AGUA' },
    { codigo: 'G14', referencia: 'TANQUES DE COMBUSTIBLE' },
    { codigo: 'G15', referencia: 'CONTENEDORES' },
    { codigo: 'G16', referencia: 'GRUPO ELECTROGENOS' },
    { codigo: 'G17', referencia: 'BOMBAS HORMIGONERAS' },
    { codigo: 'G18', referencia: 'TRANSPORTES PERSONAL' },
    { codigo: 'G19', referencia: 'ILUMINACION' },
    { codigo: 'G20', referencia: 'AUTOGRUAS' },
    { codigo: 'G21', referencia: 'GRUAS TORRE' },
    { codigo: 'G22', referencia: 'RODILLO' },
    { codigo: 'G23', referencia: 'MOTOCOMPRESOR' },
    { codigo: 'GH', referencia: 'GRUAS HIDRAULICAS' },
  ]

  for (const t of tipos) {
    await prisma.tipo.upsert({
      where: { codigo: t.codigo },
      update: {},
      create: t,
    })
  }

  // EQUIPOS
  const equipos = [
    ['C7-01', 'ROLO COMPACTADOR BOBCAT DE 73" LISO', '-', 'C7'],
    ['C7-02', 'MARTILLO HIDRAULICO', '-', 'C7'],
    ['C7-03', 'BRAZO EXCAVADORA', '-', 'C7'],
    ['C7-04', 'HOYADORA', '-', 'C7'],
    ['G10-01', 'BATEA MECANICA IVECO STRALISS (AC511LV)', '-', 'G10'],
    ['G1-01', 'CAMION VOLCADOR', 'Baja', 'G1'],
    ['G1-02', 'CAMION VOLCADOR', 'Deposito', 'G1'],
    ['G1-03', 'CAMION C/HIDROGRUA (2013) GRUBERT N-15000', 'EXAR', 'G1'],
    ['G1-04', 'CAMION VOLCADOR DOBLE DIF.', 'Deposito', 'G1'],
    ['G1-05', 'CAMION VOLCADOR DOBLE DIF.', 'EXAR', 'G1'],
    ['G1-06', 'CAMION DOBLE DIFERENCIAL', 'Deposito', 'G1'],
    ['G1-07', 'CAMION C/HIDROGRUA (2021) PALFINGER PK23500 2356 EV1', '-', 'G1'],
    ['G1-08', 'CAMION C/HIDROGRUA (2023) FERIOLI GAV231404 + CAJA CPSCH230301', '-', 'G1'],
    ['G1-09', 'CAMION C/CAJA PLAYA', '-', 'G1'],
    ['G11-01', 'SEMIRREMOLQUE (1+2)', '-', 'G11'],
    ['G12-02', 'PANCHERA', '-', 'G12'],
    ['G13-01', 'TANQUE AGUA', '-', 'G13'],
    ['G13-02', 'TANQUE AGUA (CHULENGO)', 'SALES', 'G13'],
    ['G14-01', 'TANQUE COMBUSTIBLE (CHULENGO)', 'DEPOSITO', 'G14'],
    ['G14-02', 'TANQUE COMBUSTIBLE (CHULENGO)', '-', 'G14'],
    ['G15-01', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-02', 'CONTAINER MARITIMO', 'EXAR', 'G15'],
    ['G15-03', 'CONTAINER MARITIMO', 'EXAR', 'G15'],
    ['G15-04', 'CONTAINER MARITIMO', 'EXAR', 'G15'],
    ['G15-05', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-06', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-07', 'CONTAINER MARITIMO', 'EXAR', 'G15'],
    ['G15-08', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-09', 'CONTAINER MARITIMO', 'OBRADOR', 'G15'],
    ['G15-10', 'CONTAINER MARITIMO', 'EXAR', 'G15'],
    ['G15-11', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-12', 'CONTAINER MARITIMO', 'ABRA PAMPA', 'G15'],
    ['G15-13', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-14', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-15', 'CONTAINER MARITIMO', 'EXAR', 'G15'],
    ['G15-16', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-17', 'CONTAINER MARITIMO', 'SDJ', 'G15'],
    ['G15-18', 'CONTAINER MARITIMO', 'OBRADOR', 'G15'],
    ['G15-19', 'CONTAINER MARITIMO', 'OBRADOR', 'G15'],
    ['G15-20', 'CONTAINER MARITIMO', 'OBRADOR', 'G15'],
    ['G15-21', 'CONTAINER MARITIMO', 'OBRADOR', 'G15'],
    ['G15-22', 'CONTAINER MARITIMO', 'OBRADOR', 'G15'],
    ['G16-01', 'GRUPO ELECTROGENO GEOMEMBRANA', 'SDJ', 'G16'],
    ['G16-02', 'GRUPO ELECTROGENO GEOMEMBRANA', 'SDJ', 'G16'],
    ['G16-03', 'GRUPO ELECTROGENO GEOMEMBRANA', 'SDJ', 'G16'],
    ['G16-04', 'GRUPO ELECTROGENO GEOMEMBRANA', 'SDJ', 'G16'],
    ['G17-01', 'BOMBA PARA HORMIGON DE REMOLQUE + KIT DE CAÑERIA', 'Obrador', 'G17'],
    ['G17-02', 'BOMBA PARA HORMIGON DE REMOLQUE + KIT DE CAÑERIA', '-', 'G17'],
    ['G18-01', 'MINIBUS', '-', 'G18'],
    ['G18-02', 'COLECTIVO', '-', 'G18'],
    ['G19-01', 'TORRE DE ILUMINACION', '-', 'G19'],
    ['G20-01', 'CAMION GRUA', 'SDJ', 'G20'],
    ['G2-02', 'CAMIONETA D/C 4X4', 'Olaroz - Sales de Jujuy', 'G2'],
    ['G2-03', 'CAMIONETA D/C 4X2', 'Personal', 'G2'],
    ['G2-04', 'CAMIONETA S/C 4X2', 'San Salvador de Jujuy', 'G2'],
    ['G2-05', 'CAMIONETA D/C 4X2', 'Cauchari - Exar', 'G2'],
    ['G2-06', 'CAMIONETA D/C 4X4', 'Personal', 'G2'],
    ['G2-07', 'CAMIONETA D/C 4X4', 'Personal', 'G2'],
    ['G2-08', 'CAMIONETA D/C 4X4', 'Personal', 'G2'],
    ['G2-09', 'CAMIONETA D/C 4X2', 'Olaroz - Sales de Jujuy', 'G2'],
    ['G2-10', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G21-01', 'GRUA TORRE', 'Esperanza IX y X', 'G21'],
    ['G2-11', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-12', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-13', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-14', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-15', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-16', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-17', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-18', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-19', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G2-20', 'CAMIONETA D/C 4X4', '-', 'G2'],
    ['G22-01', 'RODILLO COMPACTADOR', '-', 'G22'],
    ['G22-02', 'RODILLO COMPACTADOR', '-', 'G22'],
    ['G23-01', 'MOTOCOMPRESOR DE AIRE', '-', 'G23'],
    ['G3-03', 'RETRO PALA', 'Obrador', 'G3'],
    ['G3-04', 'RETRO PALA', 'Salar de Cauchari (EXAR)', 'G3'],
    ['G3-05', 'RETRO PALA', 'Obradoir', 'G3'],
    ['G3-06', 'RETRO PALA', 'SDJ-Geomembrana', 'G3'],
    ['G4-01', 'CARGADORA FRONTAL', 'SDJ-Geomembrana', 'G4'],
    ['G5-01', 'AUTOELEVADOR - MANIPULADOR TELESCOPICO', '-', 'G5'],
    ['G5-02', 'AUTOELEVADOR - MANIPULADOR TELESCOPICO', '-', 'G5'],
    ['G6-01', 'EXCAVADORA', 'Obrador', 'G6'],
    ['G6-02', 'EXCAVADORA', '-', 'G6'],
    ['G7-01', 'MINI CARGADORA', '-', 'G7'],
    ['G8-01', 'CARRO', '-', 'G8'],
    ['G8-02', 'CARRO', '-', 'G8'],
    ['G8-03', 'CARRO PLAYO CON BARANDA', '-', 'G8'],
    ['G8-04', 'CARRO PLAYO CON BARANDA', '-', 'G8'],
    ['G8-05', 'CARRO PLAYO CON BARANDA', '-', 'G8'],
    ['G9-01', 'CARRETON', '-', 'G9'],
    ['G9-02', 'CARRETON', '-', 'G9'],
    ['G9-03', 'CARRETON', '-', 'G9'],
    ['GH-01', 'GRUA HIDRAULICA DE PLUMA ARTICULADA TECTOR (AE758KN)', '-', 'GH'],
    ['GH-02', 'GRUA HIDRAULICA DE PLUMA ARTICULADA TECTOR ATK -170E 22 (OIB-354)', '-', 'GH'],
  ]

  for (const [codigo, nombre_equipo, ubicacion_actual, tipo_codigo] of equipos) {
    await prisma.equipo.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        nombre_equipo,
        ubicacion_actual,
        tipo_codigo,
      }
    })
  }

  console.log('Seed ejecutado correctamente.')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
