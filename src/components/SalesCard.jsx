import React, { useState } from 'react';
import Modal from './Modal'; // Importamos el componente Modal para la solicitud de PIN

const SalesCard = ({ cartItems, onRemoveProduct, onDecreaseProduct, permisosUsuario }) => {
  const [isPinModalOpen, setPinModalOpen] = useState(false); // Estado para controlar la apertura del modal de PIN
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Manejar la lógica del botón de descuento
  const handleDescuento = () => {
    if (['Admin', 'Encargado'].includes(permisosUsuario)) {
      alert('Haciendo descuento'); // Si el usuario tiene permisos, ejecutar el descuento
    } else {
      setPinModalOpen(true); // Si no tiene permisos, abrir el modal de solicitud de PIN
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-4">Ticket de Compra</h2>
        {/* Cabecera del ticket */}
        <div className="grid grid-cols-5 gap-4 font-bold border-b py-2">
          <span>Cantidad</span>
          <span>Producto</span>
          <span>Precio Unidad</span>
          <span>Precio Total</span>
          <span className="text-right">Acciones</span>
        </div>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="grid grid-cols-5 gap-4 py-2 items-center border-b">
                {/* Cantidad */}
                <span className="font-bold">{item.quantity}x</span>
                {/* Nombre del producto */}
                <span>{item.name}</span>
                {/* Precio por unidad */}
                <span>${item.price.toFixed(2)} / unidad</span>
                {/* Precio total por este producto */}
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                {/* Botones para disminuir o eliminar */}
                <div className="flex justify-end space-x-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDecreaseProduct(item.id_product_attribute)}>-</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onRemoveProduct(item.id_product_attribute)}>X</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos en el ticket.</p>
        )}
      </div>
      {/* Sección del total y los botones adicionales */}
      <div className="mt-4">
        <div className="border-t pt-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h3>
        </div>
        {/* Botones de acciones adicionales */}
        <div className="mt-4 flex justify-between space-x-4">
          <button className="bg-gray-300 text-black px-4 py-2 rounded w-full" onClick={handleDescuento}>Descuento</button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded w-full">Reimprimir Ticket</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded w-full">+ Añadir Manualmente</button>
        </div>
        {/* Botón para finalizar venta */}
        <div className="mt-4">
          <button className="bg-blue-600 text-white px-4 py-3 rounded w-full text-lg font-bold">Finalizar Venta</button>
        </div>
      </div>

      {/* Modal de solicitud de PIN */}
      <Modal isOpen={isPinModalOpen} onClose={() => setPinModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Ingrese el PIN de autorización</h2>
          <input className="border rounded w-full p-2 mb-4" type="password" placeholder="Ingrese el PIN" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={() => alert('PIN Correcto, Descuento Aplicado')}>
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SalesCard;
