import React, { useState } from 'react';
import Modal from '../modals/Modal';

const SalesCard = ({ cartItems, onRemoveProduct, onDecreaseProduct, permisosUsuario }) => {
  const [isFinalSaleModalOpen, setFinalSaleModalOpen] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [amounts, setAmounts] = useState({ efectivo: '', tarjeta: '', bizum: '' });
  const [changeAmount, setChangeAmount] = useState(0);
  const [copies, setCopies] = useState(1); // Número de copias del ticket
  const [giftTicket, setGiftTicket] = useState(false); // Estado del ticket de regalo

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleFinalSale = () => {
    setFinalSaleModalOpen(true);
  };

  const updateChangeAmount = (updatedAmounts) => {
    if (selectedMethods.length === 0) {
      setChangeAmount(0); // Si no hay métodos de pago seleccionados, el cambio es 0
    } else {
      const totalEnteredAmount = Object.values(updatedAmounts).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
      setChangeAmount(totalEnteredAmount - total); // Mostrar la diferencia, incluso si es negativa
    }
  };

  const togglePaymentMethod = (method) => {
    if (selectedMethods.includes(method)) {
      const updatedAmounts = { ...amounts, [method]: '' };
      setSelectedMethods((prevMethods) => prevMethods.filter((m) => m !== method));
      setAmounts(updatedAmounts);
      updateChangeAmount(updatedAmounts);
    } else {
      setSelectedMethods((prevMethods) => [...prevMethods, method]);
      if (method === 'tarjeta' || method === 'bizum') {
        const totalEnteredAmount = Object.values(amounts).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
        const updatedAmounts = {
          ...amounts,
          [method]: total - totalEnteredAmount > 0 ? (total - totalEnteredAmount).toFixed(2) : '',
        };
        setAmounts(updatedAmounts);
        updateChangeAmount(updatedAmounts);
      }
    }
  };

  const handleAmountChange = (method, amount) => {
    const updatedAmounts = { ...amounts, [method]: amount };
    setAmounts(updatedAmounts);
    updateChangeAmount(updatedAmounts);
  };

  const finalizeSale = () => {
    const saleData = {
      cartItems,
      total,
      selectedMethods,
      amounts,
      changeAmount,
      copies,
      giftTicket,
    };
    console.log('Información del ticket de compra:', saleData);
    setFinalSaleModalOpen(false);
  };

  const isFinalizeDisabled = Object.values(amounts).reduce((sum, value) => sum + (parseFloat(value) || 0), 0) < total;

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between relative overflow-hidden">
      {/* Fondo del logo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: 'url(/logo-marca.png)', // Asegúrate de que la imagen esté en la carpeta public y se llame logo-marca.png
          backgroundSize: '40%',
        }}
      ></div>

      <div className="relative z-10">
        <h2 className="text-lg font-semibold mb-4">Ticket de Compra</h2>
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
                <span className="font-bold">{item.quantity}x</span>
                <span>{item.product_name} {item.combination_name}</span>
                <span>{item.price.toFixed(2)} €</span>
                <span className="font-bold">{(item.price * item.quantity).toFixed(2)} €</span>
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
      <div className="relative mt-4">
        <div className="border-t pt-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Total: {total.toFixed(2)} €</h3>
        </div>
        <div className="mt-4 flex justify-between space-x-4">
          <button className="bg-gray-300 text-black px-4 py-2 rounded w-full" onClick={() => alert('Descuento aplicado')}>Descuento</button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded w-full">Reimprimir Ticket</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded w-full">+ Añadir Manualmente</button>
        </div>
        <div className="mt-4">
          <button
            className={`px-4 py-3 rounded w-full text-lg font-bold ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
            disabled={cartItems.length === 0}
            onClick={handleFinalSale}
          >
            Finalizar Venta
          </button>
        </div>
      </div>

      {/* Modal para finalizar la venta */}
      <Modal isOpen={isFinalSaleModalOpen} onClose={() => setFinalSaleModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Finalizar Venta</h2>

          {/* Número de copias y ticket regalo */}
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <label className="mr-2">Copias:</label>
              <input
                type="number"
                min="1"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
                className="border rounded p-2 w-16"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Ticket Regalo:</span>
              <button
                className={`px-4 py-2 rounded ${giftTicket ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
                onClick={() => setGiftTicket(true)}
              >
                Sí
              </button>
              <button
                className={`ml-2 px-4 py-2 rounded ${!giftTicket ? 'bg-red-600 text-white' : 'bg-gray-300'}`}
                onClick={() => setGiftTicket(false)}
              >
                No
              </button>
            </div>
          </div>

          {/* Importe total y detalles del pago */}
          <div className="mb-4">
            <h3 className="text-3xl font-bold">Importe Total: {total.toFixed(2)} €</h3>
            <p className="text-2xl font-bold">Cambio: ${changeAmount.toFixed(2)} €</p>
          </div>

          {/* Métodos de pago con inputs alineados */}
          <div className="flex flex-col space-y-4 mb-4">
            {['efectivo', 'tarjeta', 'bizum'].map((method) => (
              <div key={method} className="flex items-center space-x-4">
                <button
                  className={`w-1/3 py-4 rounded ${selectedMethods.includes(method) ? (method === 'efectivo' ? 'bg-green-500' : 'bg-blue-500') : 'bg-gray-400'} text-white`}
                  onClick={() => togglePaymentMethod(method)}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
                <input
                  className="border rounded w-2/3 p-3"
                  type="number"
                  placeholder={`Importe en ${method.charAt(0).toUpperCase() + method.slice(1)}`}
                  value={amounts[method]}
                  onChange={(e) => handleAmountChange(method, e.target.value)}
                  disabled={!selectedMethods.includes(method)}
                />
              </div>
            ))}
          </div>

          {/* Botón para finalizar la venta */}
          <button
            className={`w-full py-4 px-4 py-2 rounded text-white ${isFinalizeDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
            onClick={finalizeSale}
            disabled={isFinalizeDisabled}
          >
            Finalizar Venta
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SalesCard;
