/*
  Warnings:

  - You are about to drop the column `categoria` on the `Equipo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Equipo" DROP COLUMN "categoria";

-- AlterTable
ALTER TABLE "Tipo" ADD COLUMN     "categoria" "CategoriaEquipo" NOT NULL DEFAULT 'NO_MOTORIZADO';
