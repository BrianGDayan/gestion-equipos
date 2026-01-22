-- CreateEnum
CREATE TYPE "CategoriaEquipo" AS ENUM ('MOTORIZADO', 'NO_MOTORIZADO', 'TRANSPORTE');

-- AlterTable
ALTER TABLE "Equipo" ADD COLUMN     "anio" INTEGER,
ADD COLUMN     "categoria" "CategoriaEquipo",
ADD COLUMN     "dominio" VARCHAR(20),
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'OPERATIVO',
ADD COLUMN     "factura" VARCHAR(100),
ADD COLUMN     "horometro_actual" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "marca" VARCHAR(50),
ADD COLUMN     "modelo" VARCHAR(50),
ADD COLUMN     "numero_chasis" VARCHAR(100),
ADD COLUMN     "numero_serie" VARCHAR(100);

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "nombre_completo" VARCHAR(100);

-- CreateTable
CREATE TABLE "ParteDiario" (
    "nro_parte" BIGINT NOT NULL,
    "fecha_carga" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_parte" DATE NOT NULL,
    "equipo_codigo" VARCHAR(10) NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "obra_ubicacion" VARCHAR(150) NOT NULL,
    "horometro_inicial" DECIMAL(10,2),
    "horometro_final" DECIMAL(10,2),
    "horas_trabajadas" DECIMAL(10,2),
    "combustible" DECIMAL(10,2),
    "aceite_motor" DECIMAL(10,2),
    "aceite_hidraulico" DECIMAL(10,2),
    "grasa" DECIMAL(10,2),
    "observaciones" TEXT,

    CONSTRAINT "ParteDiario_pkey" PRIMARY KEY ("nro_parte")
);

-- CreateTable
CREATE TABLE "Repuesto" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(50),
    "marca" VARCHAR(50),
    "modelo" VARCHAR(50),
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipoToRepuesto" (
    "A" VARCHAR(10) NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "ParteDiario_equipo_codigo_idx" ON "ParteDiario"("equipo_codigo");

-- CreateIndex
CREATE INDEX "ParteDiario_fecha_parte_idx" ON "ParteDiario"("fecha_parte");

-- CreateIndex
CREATE UNIQUE INDEX "Repuesto_codigo_key" ON "Repuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipoToRepuesto_AB_unique" ON "_EquipoToRepuesto"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipoToRepuesto_B_index" ON "_EquipoToRepuesto"("B");

-- AddForeignKey
ALTER TABLE "ParteDiario" ADD CONSTRAINT "ParteDiario_equipo_codigo_fkey" FOREIGN KEY ("equipo_codigo") REFERENCES "Equipo"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParteDiario" ADD CONSTRAINT "ParteDiario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoToRepuesto" ADD CONSTRAINT "_EquipoToRepuesto_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipo"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipoToRepuesto" ADD CONSTRAINT "_EquipoToRepuesto_B_fkey" FOREIGN KEY ("B") REFERENCES "Repuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
