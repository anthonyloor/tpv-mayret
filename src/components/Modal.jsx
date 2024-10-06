import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // No mostrar nada si el modal está cerrado

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 relative">
        {/* Botón de cerrar modal dentro del modal */}
        <div className="absolute top-2 right-4">
          <button
            className="text-black font-bold text-xl"
            onClick={onClose}
          >
            X
          </button>
        </div>
        {/* Contenido del modal */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
