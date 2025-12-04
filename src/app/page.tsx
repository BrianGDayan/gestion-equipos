import TablaEquipos from '@/components/TablaEquipos';

export default function Home() {
  return (
    <div className="w-full space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary">
        <h1 className="text-2xl font-bold text-primary-dark">Panel de Gestión</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Administración de inventario y trazabilidad de equipos.
        </p>
      </div>
      <TablaEquipos />
    </div>
  );
}