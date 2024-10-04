import React, { useState } from 'react';
import NavbarCard from './components/NavbarCard.jsx';
import SalesCard from './components/SalesCard.jsx';
import ProductSearchCard from './components/ProductSearchCard.jsx';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddProduct = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  return (
    <div className="bg-gray-light min-h-screen flex flex-col">
      <NavbarCard />
      <div className="flex flex-grow p-4 space-x-4">
        <div className="w-1/3">
          <SalesCard cartItems={cartItems} />
        </div>
        <div className="w-2/3">
          <ProductSearchCard onAddProduct={handleAddProduct} />
        </div>
      </div>
    </div>
  );
}

export default App;
