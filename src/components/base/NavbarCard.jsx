import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';
import TransferForm from '../modals/transfers/TransferForm'; // Importamos el formulario de traspaso
import PermisosModal from '../modals/configuration/permissions/PermissionsModal'; // Importamos el modal de permisos
import empleadosData from '../../data/empleados.json'; // Importamos los datos de empleados

// Inicializamos los permisos en memoria
const permisosIniciales = {
  "Vendedor TPV": {
    "acceso_ejecutar": "Denegado"
  },
  "Encargado": {
    "acceso_ejecutar": "Permitido"
  },
  "Admin": {
    "acceso_ejecutar": "Permitido"
  }
};

const NavbarCard = () => {
  const [isModalOpen, setModalOpen] = useState(false); // Control del modal abierto/cerrado
  const [currentView, setCurrentView] = useState('main'); // Control de vista actual ('main', 'traspasos', 'entrada', 'salida')
  const [empleadoActual, setEmpleadoActual] = useState(null); // Estado para almacenar el empleado actual
  const [permisosGlobal, setPermisosGlobal] = useState(permisosIniciales); // Estado para manejar los permisos globales

  useEffect(() => {
    // Simulamos que el empleado actual es el Admin cargando su información desde empleados.json
    const empleadoAdmin = empleadosData.find(emp => emp.nivel_permisos === 'Admin');
    setEmpleadoActual(empleadoAdmin);
  }, []);

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentView('main'); // Volvemos a la vista principal del modal
  };

  // Función para abrir la vista de selección dentro del modal
  const openTransferView = () => {
    setModalOpen(true); // Abrimos el modal
  };

  // Función para abrir la vista de configuración
  const openConfigView = () => {
    setModalOpen(true);
    setCurrentView('config'); // Cambiamos a la vista de configuración
  };

  // Función para seleccionar la vista de traspasos, entrada o salida
  const selectTransferType = (view) => {
    setCurrentView(view); // Cambiamos a la vista seleccionada
  };

  // Función para volver a la vista principal del modal
  const goBackToMainView = () => {
    setCurrentView('main');
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Pueblo Nuevo TPV</h1>
      <div className="space-x-4">
        {/* Botón único de Traspasos */}
        <button className="text-black hover:text-gray-600" onClick={openTransferView}>
          Traspasos
        </button>
        <button className="text-black hover:text-gray-600">Etiquetas</button>
        <button className="text-black hover:text-gray-600">Caja</button>
        {/* Botón para abrir la configuración */}
        <button className="text-black hover:text-gray-600" onClick={openConfigView}>
          Configuración
        </button>
      </div>

      {/* Modal para gestionar traspasos, entradas o salidas */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {currentView === 'main' && (
          <div className="transition-opacity duration-300 ease-in-out">
            <h2 className="text-xl font-bold mb-4">Gestión de Mercadería</h2>
            <div className="space-y-4">
              {/* Opciones para seleccionar tipo de operación */}
              <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={() => selectTransferType('traspasos')}>
                Traspasos entre Tiendas
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded w-full" onClick={() => selectTransferType('entrada')}>
                Entrada de Mercadería
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={() => selectTransferType('salida')}>
                Salida de Mercadería
              </button>
            </div>
          </div>
        )}

        {/* Modal de Configuración */}
        {currentView === 'config' && (
          <div className="transition-opacity duration-300 ease-in-out">
            <h2 className="text-xl font-bold mb-4">Configuración</h2>
            <div className="space-y-4">
              {/* Botones para cada opción de configuración */}
              <button className="bg-gray-300 text-black px-4 py-2 rounded w-full" onClick={() => setCurrentView('permisos')}>
                Permisos
              </button>
              <button className="bg-gray-300 text-black px-4 py-2 rounded w-full">Impresoras</button>
              <button className="bg-gray-300 text-black px-4 py-2 rounded w-full">Inventario</button>
            </div>
          </div>
        )}

        {/* Modal para gestionar permisos */}
        {currentView === 'permisos' && (
          <PermisosModal onClose={closeModal} empleadoActual={empleadoActual} setPermisosGlobal={setPermisosGlobal} />
        )}

        {/* Componente TransferForm dependiendo del tipo de operación con botón Atrás alineado */}
        {['traspasos', 'entrada', 'salida'].includes(currentView) && (
          <div className="transition-opacity duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={goBackToMainView}>
                Atrás
              </button>
              <div className="invisible">Atrás</div>
            </div>
            <TransferForm type={currentView} onSave={closeModal} permisosUsuario={empleadoActual?.nivel_permisos} permisosGlobal={permisosGlobal} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NavbarCard;
