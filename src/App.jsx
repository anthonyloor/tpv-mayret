import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Cambiamos Switch por Routes
import NavbarCard from './components/NavbarCard.jsx';
import SalesCard from './components/SalesCard.jsx';
import ProductSearchCard from './components/ProductSearchCard.jsx';
import PinPage from './components/PinPage.jsx'; // Importamos la página del PIN

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Función para añadir productos al ticket, verificando la cantidad máxima disponible
  const handleAddProduct = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(
        (item) => item.id_product_attribute === product.id_product_attribute
      );

      if (existingProduct) {
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
    <Router>
      <div className="bg-gray-light min-h-screen flex flex-col">
        <NavbarCard />
        <Routes> {/* Cambiamos Switch por Routes */}
          <Route
            path="/"
            element={
              <div className="flex flex-col md:flex-row flex-grow p-4 space-y-4 md:space-y-0 md:space-x-4">
        {/* SalesCard se adapta a pantalla completa en móviles y 1/3 en pantallas grandes */}
                <div className="w-full md:w-1/3">
                  <SalesCard
                    cartItems={cartItems}
                    onRemoveProduct={handleRemoveProduct}
                    onDecreaseProduct={handleDecreaseProduct}
                  />
                </div>
        {/* ProductSearchCard se adapta a pantalla completa en móviles y 2/3 en pantallas grandes */}
                <div className="w-full md:w-2/3">
                  <ProductSearchCard onAddProduct={handleAddProduct} />
                </div>
              </div>
            }
          />
          <Route path="/pin" element={<PinPage />} /> {/* Nueva ruta para la página del PIN */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
