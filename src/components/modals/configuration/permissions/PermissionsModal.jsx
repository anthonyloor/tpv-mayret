import React, { useState } from 'react';

const PermissionsModal = ({ onClose, empleadoActual, setPermisosGlobal }) => {
  const [permisos, setPermisos] = useState({
    "Vendedor TPV": { "acceso_ejecutar": "Denegado" },
    "Encargado": { "acceso_ejecutar": "Permitido" },
    "Admin": { "acceso_ejecutar": "Permitido" }
  });

  // Manejar el cambio de permisos para botones o modales específicos
  const handlePermisoChange = (rol, accion, permiso) => {
    setPermisos((prevPermisos) => ({
      ...prevPermisos,
      [rol]: { ...prevPermisos[rol], [accion]: permiso }
    }));
  };

  // Función para guardar los permisos en memoria
  const handleGuardarPermisos = () => {
    setPermisosGlobal(permisos); // Actualizamos los permisos globales para la aplicación
    alert('Permisos actualizados correctamente');
    onClose();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Configurar Permisos</h2>
      {empleadoActual?.nivel_permisos === 'Admin' ? (
        <div>
          {['Vendedor TPV', 'Encargado', 'Admin'].map((rol) => (
            <div key={rol} className="space-y-4">
              <h3 className="font-bold">{rol}</h3>
              <div className="flex justify-between items-center">
                <span>Acceso al botón "Ejecutar"</span>
                <select
                  className="border rounded p-2"
                  value={permisos[rol]?.acceso_ejecutar || 'Denegado'}
                  onChange={(e) => handlePermisoChange(rol, 'acceso_ejecutar', e.target.value)}
                >
                  <option value="Denegado">Denegado</option>
                  <option value="Permitido">Permitido</option>
                </select>
              </div>
            </div>
          ))}
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleGuardarPermisos}>
            Guardar Permisos
          </button>
        </div>
      ) : (
        <p className="text-red-500">No tienes permisos para modificar la configuración.</p>
      )}
    </div>
  );
};

export default PermissionsModal;
