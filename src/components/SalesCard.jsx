import React from 'react';

const SalesCard = ({ cartItems }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between py-2">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos en el carrito.</p>
      )}
      <div className="mt-4 border-t pt-4">
        <h3 className="font-bold">Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default SalesCard;
