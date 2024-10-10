// ProductSearchCardForTransfer.jsx
import React, { useState } from 'react';
import ProductSelectionModal from './ProductSelectionModal';
import productsData from '../../../data/products.json';

const ProductSearchCardForTransfer = ({ onAddProduct, selectedOriginStore, selectedDestinationStore, type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);

  const isSearchDisabled = !selectedOriginStore || (type === 'traspasos' && !selectedDestinationStore);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm.length >= 3 && !isSearchDisabled) {
      performSearch();
    }
  };

  const performSearch = () => {
    // Filtrar productos que coincidan con el término de búsqueda y la tienda origen
    const results = productsData.filter(
      (product) =>
        (product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.combination_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.ean13_combination.toString().includes(searchTerm)) &&
        product.id_shop.toString() === selectedOriginStore
    );

    if (results.length === 1) {
      onAddProduct(results[0]);
      setSearchTerm('');
    } else if (results.length > 1) {
      setModalProducts(results);
      setIsModalOpen(true);
    } else {
      alert('No se encontraron productos para la tienda origen seleccionada.');
    }
  };

  const handleSelectProduct = (product) => {
    onAddProduct(product);
    setIsModalOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="mt-6 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Buscar Producto</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o código..."
        className="border rounded p-2 w-full mb-4"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        disabled={isSearchDisabled}
      />
      {isSearchDisabled && (
        <p className="text-red-500">
          Por favor, seleccione {!selectedOriginStore ? 'la tienda origen' : 'la tienda destino'} antes de buscar.
        </p>
      )}

      {/* Modal para seleccionar el producto */}
      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={modalProducts}
        onSelectProduct={handleSelectProduct}
        originShopId={selectedOriginStore}
        destinationShopId={selectedDestinationStore}
      />
    </div>
  );
};

export default ProductSearchCardForTransfer;
