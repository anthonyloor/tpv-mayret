import React from 'react';

const ProductSelectionModal = ({ isOpen, onClose, products, onSelectProduct }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <div className="absolute top-2 right-4">
          <button className="text-black font-bold text-xl" onClick={onClose}>
            X
          </button>
        </div>
        <h2 className="text-lg font-bold mb-4">Seleccionar Producto</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id_product_attribute} className="py-2">
              <button
                className="w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded"
                onClick={() => onSelectProduct(product)}
              >
                {product.name} - ${product.price.toFixed(2)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
