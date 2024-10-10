// TransferForm.jsx
import React, { useState, useEffect } from 'react';
import ProductSearchCardForTransfer from './ProductSearchCardForTransfer';
import shopsData from '../../../data/shop.json'; // Asegúrate de que la ruta es correcta
import sessionConfig from '../../../data/sessionConfig.json';

const TransferForm = ({ type, onSave, permisosUsuario, permisosGlobal }) => {
  const [productsToTransfer, setProductsToTransfer] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedOriginStore, setSelectedOriginStore] = useState('');
  const [selectedDestinationStore, setSelectedDestinationStore] = useState('');
  const [permisoEjecutar, setPermisoEjecutar] = useState('Denegado');

  // Cargar datos de tiendas y establecer tienda origen por defecto
  useEffect(() => {
    setShops(shopsData);
    // Establecer la tienda origen por defecto desde sessionConfig
    setSelectedOriginStore(sessionConfig.id_shop.toString());
  }, []);

  // Comprobar si el usuario tiene permisos para ejecutar
  useEffect(() => {
    setPermisoEjecutar(permisosGlobal[permisosUsuario]?.acceso_ejecutar || 'Denegado');
  }, [permisosUsuario, permisosGlobal]);

  // Añadir producto a la lista de productos a transferir
  const handleAddProduct = (product) => {
    setProductsToTransfer((prevProducts) => {
      const existingProduct = prevProducts.find(
        (p) => p.id_product_attribute === product.id_product_attribute
      );
      if (existingProduct) {
        // Aumentar la cantidad
        return prevProducts.map((p) =>
          p.id_product_attribute === product.id_product_attribute
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        // Añadir nuevo producto con cantidad 1
        return [...prevProducts, { ...product, quantity: 1 }];
      }
    });
  };

  // Cambiar la cantidad de un producto
  const handleQuantityChange = (id_product_attribute, quantity) => {
    setProductsToTransfer((prevProducts) =>
      prevProducts.map((product) =>
        product.id_product_attribute === id_product_attribute
          ? { ...product, quantity: parseInt(quantity, 10) }
          : product
      )
    );
  };

  // Eliminar un producto de la lista
  const handleRemoveProduct = (id_product_attribute) => {
    setProductsToTransfer((prevProducts) =>
      prevProducts.filter((product) => product.id_product_attribute !== id_product_attribute)
    );
  };
  

  // Función para manejar el clic del botón Ejecutar
  const handleEjecutar = () => {
    alert('Traspaso ejecutado');
  };

  // Comprobar si se ha seleccionado la misma tienda en origen y destino
  const isSameStoreSelected = selectedOriginStore === selectedDestinationStore && type === 'traspasos';

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">
        {type === 'traspasos' ? 'Traspaso entre Tiendas' : type === 'entrada' ? 'Entrada de Mercadería' : 'Salida de Mercadería'}
      </h2>

      {/* Parte superior: Nombre del traspaso, fecha y búsqueda de productos */}
      <div className="grid grid-cols-2 gap-4">
        {/* Nombre del traspaso y fecha */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Nombre del traspaso</label>
            <input className="border rounded w-full p-2" type="text" placeholder="Ej: Traspaso ropa navidad" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Fecha</label>
            <input className="border rounded w-full p-2" type="date" disabled defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        {/* Selección de tiendas */}
        <div className="space-y-4">
          {/* Tienda Origen */}
          <div>
            <label className="block text-sm font-bold mb-2">Tienda{type === 'traspasos' && ' Origen'}</label>
            <select
              className="border rounded w-full p-2"
              value={selectedOriginStore}
              onChange={(e) => setSelectedOriginStore(e.target.value)}
            >
              <option value="">Selecciona una tienda</option>
              {shops.map((shop) => (
                <option key={shop.id_shop} value={shop.id_shop}>
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>

          {/* Tienda Destino */}
          {type === 'traspasos' && (
            <div>
              <label className="block text-sm font-bold mb-2">Tienda Destino</label>
              <select
                className="border rounded w-full p-2"
                value={selectedDestinationStore}
                onChange={(e) => setSelectedDestinationStore(e.target.value)}
              >
                <option value="">Selecciona una tienda</option>
                {shops
                  .filter((shop) => shop.id_shop !== selectedOriginStore)
                  .map((shop) => (
                    <option key={shop.id_shop} value={shop.id_shop}>
                      {shop.shop_name}
                    </option>
                  ))}
              </select>
              {isSameStoreSelected && (
                <p className="text-red-500">La tienda origen y destino no pueden ser la misma.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buscador de productos */}
      <ProductSearchCardForTransfer
        onAddProduct={handleAddProduct}
        selectedOriginStore={selectedOriginStore}
        selectedDestinationStore={selectedDestinationStore}
        type={type}
      />

      {/* Tabla de productos a traspasar */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Productos a Traspasar:</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Producto</th>
              <th className="py-2 px-4 border-b text-left">Cantidad</th>
              <th className="py-2 px-4 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {productsToTransfer.map((product, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{product.product_name} {product.combination_name}</td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    min="1"
                    className="border rounded w-12 p-1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id_product_attribute, e.target.value)}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRemoveProduct(product.id_product_attribute)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de guardar y ejecutar */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={onSave}>
          Guardar
        </button>

        {/* Botón Ejecutar solo accesible si los permisos lo permiten */}
        {permisoEjecutar === 'Permitido' && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            onClick={handleEjecutar}
            disabled={
              isSameStoreSelected ||
              !selectedOriginStore ||
              (type === 'traspasos' && !selectedDestinationStore)
            }
          >
            Ejecutar
          </button>
        )}
      </div>
    </div>
  );
};

export default TransferForm;
