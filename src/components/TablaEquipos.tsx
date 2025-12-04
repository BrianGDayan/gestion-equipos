'use client';

import React, { useState, useEffect } from 'react';

interface Equipo {
  codigo: string;
  nombre_equipo: string;
  ubicacion_actual: string | null;
}

interface EstadoEquipoNuevo {
  codigo: string;
  nombre_equipo: string;
  ubicacion_actual: string;
}

export default function TablaEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [equipoNuevo, setEquipoNuevo] = useState<EstadoEquipoNuevo>({
    codigo: '',
    nombre_equipo: '',
    ubicacion_actual: '',
  });

  const [codigoEnEdicion, setCodigoEnEdicion] = useState<string | null>(null);
  const [ubicacionEditada, setUbicacionEditada] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const res = await fetch('/api/equipos');
      if (!res.ok) throw new Error('Error al cargar equipos');
      const data = await res.json();
      setEquipos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const crearEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipoNuevo),
      });

      if (!res.ok) throw new Error('Error al crear equipo');
      
      const equipoCreado = await res.json();
      setEquipos([...equipos, equipoCreado]); 
      setEquipoNuevo({ codigo: '', nombre_equipo: '', ubicacion_actual: '' }); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const iniciarEdicion = (equipo: Equipo) => {
    setCodigoEnEdicion(equipo.codigo);
    setUbicacionEditada(equipo.ubicacion_actual || '');
  };

  const cancelarEdicion = () => {
    setCodigoEnEdicion(null);
    setUbicacionEditada('');
  };

  const guardarUbicacion = async (codigo: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/equipos/${codigo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ubicacion_actual: ubicacionEditada }),
      });

      if (!res.ok) throw new Error('Error actualizando ubicación');

      setEquipos(prev => prev.map(eq => 
        eq.codigo === codigo ? { ...eq, ubicacion_actual: ubicacionEditada } : eq
      ));
      setCodigoEnEdicion(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-text mb-4 uppercase tracking-wide border-l-4 border-secondary pl-3">
        datos equipos-rodados-maquinas-herramientas-varios
      </h2>

      {error && <div className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</div>}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-primary-mid text-white uppercase text-xs">
            <tr>
              <th className="py-3 px-4 border-b border-primary-dark w-1/6">Código</th>
              <th className="py-3 px-4 border-b border-primary-dark w-2/6">Equipo / Nombre</th>
              <th className="py-3 px-4 border-b border-primary-dark w-2/6">Ubicación Actual</th>
              <th className="py-3 px-4 border-b border-primary-dark w-1/6 text-center">Acciones</th>
            </tr>
          </thead>
          
          <tbody className="text-gray-700">
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">Cargando datos...</td>
              </tr>
            )}

            <tr className="bg-gray-50 border-b-2 border-gray-200">
               <td className="p-2 border-r">
                 <input 
                   type="text" 
                   placeholder="Nuevo Cód."
                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                   value={equipoNuevo.codigo}
                   onChange={(e) => setEquipoNuevo({...equipoNuevo, codigo: e.target.value})}
                 />
               </td>
               <td className="p-2 border-r">
                 <input 
                   type="text" 
                   placeholder="Nombre del Equipo"
                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                   value={equipoNuevo.nombre_equipo}
                   onChange={(e) => setEquipoNuevo({...equipoNuevo, nombre_equipo: e.target.value})}
                 />
               </td>
               <td className="p-2 border-r">
                 <input 
                   type="text" 
                   placeholder="Ubicación Inicial"
                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                   value={equipoNuevo.ubicacion_actual}
                   onChange={(e) => setEquipoNuevo({...equipoNuevo, ubicacion_actual: e.target.value})}
                 />
               </td>
               <td className="p-2 text-center">
                 <button 
                   onClick={crearEquipo}
                   disabled={!equipoNuevo.codigo || !equipoNuevo.nombre_equipo || isSaving}
                   className="bg-secondary hover:bg-secondary-dark text-white font-bold py-1 px-4 rounded text-xs shadow disabled:opacity-50 transition-colors"
                 >
                   {isSaving ? '...' : 'AGREGAR'}
                 </button>
               </td>
            </tr>

            {!isLoading && equipos.map((eq) => {
              const estaEditando = codigoEnEdicion === eq.codigo;

              return (
                <tr key={eq.codigo} className="border-b hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-4 border-r font-medium text-gray-900">{eq.codigo}</td>
                  <td className="py-3 px-4 border-r">{eq.nombre_equipo}</td>
                  
                  <td className={`py-3 px-4 border-r ${estaEditando ? 'bg-yellow-50' : ''}`}>
                    {estaEditando ? (
                      <input 
                        type="text" 
                        autoFocus
                        className="w-full p-1 border border-primary rounded"
                        value={ubicacionEditada}
                        onChange={(e) => setUbicacionEditada(e.target.value)}
                      />
                    ) : (
                      <span className="text-gray-600">{eq.ubicacion_actual || '-'}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center space-x-2">
                    {estaEditando ? (
                      <>
                        <button 
                          onClick={() => guardarUbicacion(eq.codigo)}
                          className="text-green-600 hover:text-green-800 font-bold text-xs underline"
                        >
                          Guardar
                        </button>
                        <button 
                          onClick={cancelarEdicion}
                          className="text-red-500 hover:text-red-700 text-xs ml-2"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => iniciarEdicion(eq)}
                        className="text-primary hover:text-primary-dark font-semibold text-xs border border-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-all"
                      >
                        Modificar Ubicación
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {!isLoading && equipos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay equipos registrados. Utiliza el formulario superior para agregar uno.
          </div>
        )}
      </div>
    </div>
  );
}