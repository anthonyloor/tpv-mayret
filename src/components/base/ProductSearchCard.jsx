import React, { useState } from 'react';
import productsData from '../../data/products.json'; // Carga de productos desde products.json

const ProductSearchCard = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleKeyDown = (event) => {
    // Solo realiza la búsqueda si el término tiene al menos 3 caracteres y se presiona Enter
    if (event.key === 'Enter' && searchTerm.length >= 3) {
      const results = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.barcode.includes(searchTerm)
      );

      setFilteredProducts(results);

      // Si solo hay un producto en los resultados, añadirlo automáticamente al carrito
      if (results.length === 1) {
        onAddProduct(results[0]);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Buscar Producto</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o código..."
        className="border rounded p-2 w-full mb-4"
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown} // Manejar el evento de presionar tecla
      />
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 226px)' }}>
        <table className="min-w-full bg-white border">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="py-2 px-4 border-b text-left">Nombre</th>
              <th className="py-2 px-4 border-b text-left">Referencia</th>
              <th className="py-2 px-4 border-b text-left">Código de Barras</th>
              <th className="py-2 px-4 border-b text-left">Precio</th>
              <th className="py-2 px-4 border-b text-left">Cantidad</th>
              <th className="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id_product_attribute}>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.reference}</td>
                <td className="py-2 px-4 border-b">{product.barcode}</td>
                <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-black text-white px-4 py-2 rounded"
                    onClick={() => onAddProduct(product)}
                  >
                    Añadir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSearchCard;
