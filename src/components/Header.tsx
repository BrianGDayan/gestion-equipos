import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-primary-dark text-white p-1">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <Image
                    src="/img/logo.png"
                    alt="GECO logo"
                    width={180} // Ancho original
                    height={52} // Alto original
                    className="w-auto h-auto"
                    priority
                />
                <h1 className="text-lg sm:text-3xl font-bold mx-auto text-center">
                    Sistema de Gestión de Equipos
                </h1>
            </div>
        </header>
    );
}