import React, { useState } from 'react';
import ProductSearchCardForTransfer from './ProductSearchCardForTransfer';
import ProductSelectionModal from './ProductSelectionModal';

const TransferForm = ({ type, onSave, permisosUsuario, permisosGlobal }) => {
  const [productsToTransfer, setProductsToTransfer] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedStore2, setSelectedStore2] = useState(''); // Solo para traspasos entre tiendas
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [permisoEjecutar, setPermisoEjecutar] = useState('Denegado');

  // Comprobamos si el usuario tiene permisos para ejecutar
  useState(() => {
    setPermisoEjecutar(permisosGlobal[permisosUsuario]?.acceso_ejecutar || 'Denegado');
  }, [permisosUsuario, permisosGlobal]);

  // Añadir producto a la lista de productos a transferir
  const handleAddProduct = (product) => {
    setProductsToTransfer((prevProducts) => [...prevProducts, { ...product, quantity: 1 }]);
  };

  // Mostrar modal con múltiples productos
  const handleMultipleResults = (products) => {
    setModalProducts(products);
    setModalOpen(true);
  };

    // Función para manejar el clic del botón Ejecutar
    const handleEjecutar = () => {
      alert('Traspaso ejecutado');
    };

  // Seleccionar un producto desde el modal
  const handleSelectProduct = (product) => {
    handleAddProduct(product);
    setModalOpen(false);
  };

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
            <label className="block text-sm font-bold mb-2">Nombre del Traspaso</label>
            <input className="border rounded w-full p-2" type="text" placeholder="Ej: Traspaso de verano" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Fecha</label>
            <input className="border rounded w-full p-2" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          {/* Buscador de productos */}
          <ProductSearchCardForTransfer onAddProduct={handleAddProduct} onMultipleResults={handleMultipleResults} />
        </div>

        {/* Selección de tiendas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Seleccionar Tienda{type === 'traspasos' && ' 1'}</label>
            <select className="border rounded w-full p-2" onChange={(e) => setSelectedStore(e.target.value)}>
              <option value="">Selecciona una tienda</option>
              <option value="Tienda 1">Tienda 1</option>
              <option value="Tienda 2">Tienda 2</option>
              {/* Más tiendas */}
            </select>
          </div>

          {type === 'traspasos' && (
            <div>
              <label className="block text-sm font-bold mb-2">Seleccionar Tienda 2</label>
              <select className="border rounded w-full p-2" onChange={(e) => setSelectedStore2(e.target.value)}>
                <option value="">Selecciona una tienda</option>
                <option value="Tienda 1">Tienda 1</option>
                <option value="Tienda 2">Tienda 2</option>
                {/* Más tiendas */}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de productos a traspasar */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Productos a Transferir:</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Producto</th>
              <th className="py-2 px-4 border-b text-left">Cantidad</th>
              <th className="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productsToTransfer.map((product, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
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
          <button className="bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleEjecutar}>
            Ejecutar
          </button>
        )}
      </div>

      {/* Modal de selección de productos */}
      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        products={modalProducts}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
};

export default TransferForm;
