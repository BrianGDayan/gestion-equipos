import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
  ]

  console.log('Sembrando datos de tipos...')
  
  for (const tipo of tipos) {
    await prisma.tipo.upsert({
      where: { codigo: tipo.codigo },
      update: {},
      create: tipo,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })