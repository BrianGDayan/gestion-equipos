/*
  Warnings:

  - You are about to alter the column `equipo_codigo` on the `TrazabilidadUbicacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - Added the required column `tipo_codigo` to the `Equipo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TrazabilidadUbicacion" DROP CONSTRAINT "TrazabilidadUbicacion_equipo_codigo_fkey";

-- AlterTable
ALTER TABLE "Equipo" ADD COLUMN     "tipo_codigo" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "TrazabilidadUbicacion" ALTER COLUMN "equipo_codigo" SET DATA TYPE VARCHAR(10);

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_tipo_codigo_fkey" FOREIGN KEY ("tipo_codigo") REFERENCES "Tipo"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrazabilidadUbicacion" ADD CONSTRAINT "TrazabilidadUbicacion_equipo_codigo_fkey" FOREIGN KEY ("equipo_codigo") REFERENCES "Equipo"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;
