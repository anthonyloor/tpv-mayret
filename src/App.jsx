import React, { useState } from 'react';
import NavbarCard from './components/NavbarCard.jsx';
import SalesCard from './components/SalesCard.jsx';
import ProductSearchCard from './components/ProductSearchCard.jsx';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Función para añadir productos al ticket, verificando la cantidad máxima disponible
  const handleAddProduct = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(
        (item) => item.id_product_attribute === product.id_product_attribute
      );

      // Si el producto ya está en el carrito
      if (existingProduct) {
        // Verificar si la cantidad es menor a la cantidad disponible
        if (existingProduct.quantity < product.quantity) {
          return prevItems.map((item) =>
            item.id_product_attribute === product.id_product_attribute
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert('No puedes añadir más de la cantidad disponible');
          return prevItems;
        }
      } else {
        // Si el producto no está en el carrito, añadir con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Función para reducir la cantidad de un producto o eliminarlo si llega a 0
  const handleDecreaseProduct = (idProductAttribute) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id_product_attribute === idProductAttribute
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Función para eliminar un producto completamente del ticket
  const handleRemoveProduct = (idProductAttribute) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id_product_attribute !== idProductAttribute)
    );
  };

  return (
    <div className="bg-gray-light min-h-screen flex flex-col">
      <NavbarCard />
      <div className="flex flex-grow p-4 space-x-4">
        <div className="w-1/3">
          <SalesCard
            cartItems={cartItems}
            onRemoveProduct={handleRemoveProduct}
            onDecreaseProduct={handleDecreaseProduct}
          />
        </div>
        <div className="w-2/3">
          <ProductSearchCard onAddProduct={handleAddProduct} />
        </div>
      </div>
    </div>
  );
}

export default App;
