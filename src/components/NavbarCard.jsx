import React, { useState } from 'react';
import Modal from './Modal';
import TransferForm from './TransferForm';  // Importamos el formulario de traspaso

const NavbarCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);  // Control del modal abierto/cerrado
  const [currentView, setCurrentView] = useState('main');  // Control de vista actual ('main', 'traspasos', 'entrada', 'salida')

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentView('main');  // Volvemos a la vista principal del modal
  };

  // Función para abrir la vista de selección dentro del modal
  const openTransferView = () => {
    setModalOpen(true);  // Abrimos el modal
  };

  // Función para seleccionar la vista de traspasos, entrada o salida
  const selectTransferType = (view) => {
    setCurrentView(view);  // Cambiamos a la vista seleccionada
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
        <button className="text-black hover:text-gray-600">Configuración</button>
      </div>

      {/* Modal para gestionar traspasos, entradas o salidas */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {currentView === 'main' && (
          <div>
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

        {/* Componente TransferForm dependiendo del tipo de operación */}
        {currentView === 'traspasos' && <TransferForm type="traspasos" onSave={closeModal} />}
        {currentView === 'entrada' && <TransferForm type="entrada" onSave={closeModal} />}
        {currentView === 'salida' && <TransferForm type="salida" onSave={closeModal} />}
      </Modal>
    </div>
  );
};

export default NavbarCard;
