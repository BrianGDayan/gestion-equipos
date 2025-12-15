-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "clave" VARCHAR(25) NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);
