import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarCard from './components/base/NavbarCard.jsx';
import SalesCard from './components/base/SalesCard.jsx';
import ProductSearchCard from './components/base/ProductSearchCard.jsx';
import PinPage from './components/pages/PinPage.jsx';
import sessionConfig from './data/sessionConfig.json';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [currentShop, setCurrentShop] = useState(sessionConfig);
  const [lastAction, setLastAction] = useState(null);

  // Función para añadir productos al ticket, verificando la cantidad máxima disponible
  const handleAddProduct = (
    product,
    stockQuantity,
    allowOutOfStockSales,
    exceedsStockCallback,
    forceAdd = false
  ) => {
    const existingProduct = cartItems.find(
      (item) => item.id_product_attribute === product.id_product_attribute
    );

    const maxQuantity =
      stockQuantity !== null && stockQuantity !== undefined ? stockQuantity : Infinity;

    let newQuantity = existingProduct ? existingProduct.quantity + 1 : 1;

    if (newQuantity > maxQuantity && !forceAdd) {
      if (!allowOutOfStockSales) {
        alert('No puedes añadir más de la cantidad disponible');
        return;
      } else {
        // Si se permite vender sin stock, llamamos al callback para mostrar el modal
        if (exceedsStockCallback) exceedsStockCallback(true);
        return;
      }
    }

    // Ahora actualizamos el carrito
    setCartItems((prevItems) => {
      if (existingProduct) {
        return prevItems.map((item) =>
          item.id_product_attribute === product.id_product_attribute
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Establecemos la última acción para la animación en SalesCard
    setLastAction({
      id: product.id_product_attribute,
      action: 'add',
      timestamp: Date.now(),
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

    // Establecemos la última acción para la animación en SalesCard
    setLastAction({
      id: idProductAttribute,
      action: 'decrease',
      timestamp: Date.now(),
    });
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
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col md:flex-row flex-grow p-4 space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-2/5">
                  <SalesCard
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    onRemoveProduct={handleRemoveProduct}
                    onDecreaseProduct={handleDecreaseProduct}
                    lastAction={lastAction}
                  />
                </div>
                <div className="w-full md:w-3/5">
                  <ProductSearchCard onAddProduct={handleAddProduct} />
                </div>
              </div>
            }
          />
          <Route path="/pin" element={<PinPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
