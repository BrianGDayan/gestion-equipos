-- CreateTable
CREATE TABLE "Equipo" (
    "codigo" VARCHAR(10) NOT NULL,
    "nombre_equipo" VARCHAR(100) NOT NULL,
    "ubicacion_actual" VARCHAR(50),

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Tipo" (
    "codigo" VARCHAR(10) NOT NULL,
    "referencia" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tipo_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "TrazabilidadUbicacion" (
    "id" SERIAL NOT NULL,
    "ubicacion" VARCHAR(255) NOT NULL,
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipo_codigo" TEXT NOT NULL,

    CONSTRAINT "TrazabilidadUbicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_referencia_key" ON "Tipo"("referencia");

-- CreateIndex
CREATE INDEX "TrazabilidadUbicacion_equipo_codigo_idx" ON "TrazabilidadUbicacion"("equipo_codigo");

-- AddForeignKey
ALTER TABLE "TrazabilidadUbicacion" ADD CONSTRAINT "TrazabilidadUbicacion_equipo_codigo_fkey" FOREIGN KEY ("equipo_codigo") REFERENCES "Equipo"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;
