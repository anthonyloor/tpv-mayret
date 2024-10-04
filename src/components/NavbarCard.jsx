import React from 'react';

const NavbarCard = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Pueblo Nuevo TPV</h1>
      <div className="space-x-4">
        <button className="text-black hover:text-gray-600">Traspasos</button>
        <button className="text-black hover:text-gray-600">Etiquetas</button>
        <button className="text-black hover:text-gray-600">Caja</button>
        <button className="text-black hover:text-gray-600">Configuración</button>
      </div>
    </div>
  );
};

export default NavbarCard;
