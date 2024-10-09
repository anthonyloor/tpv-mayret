import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';
import productsData from '../../data/products.json';
import sessionConfig from '../../data/sessionConfig.json';

const ProductSearchCard = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProductImage, setSelectedProductImage] = useState('');
  const [currentShop, setCurrentShop] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [productToConfirm, setProductToConfirm] = useState(null);

  useEffect(() => {
    // Cargamos la configuración de la sesión para obtener la tienda en curso
    setCurrentShop(sessionConfig);
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleKeyDown = (event) => {
    // Solo realiza la búsqueda si el término tiene al menos 3 caracteres y se presiona Enter
    if (event.key === 'Enter' && searchTerm.length >= 3) {
      const results = productsData.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ean13_combination.toString().includes(searchTerm)
      );
  
      const filteredForCurrentShop = results.filter(
        (product) => product.shop_name === currentShop.shop_name
      );
  
      setFilteredProducts(groupProductsByProductName(results));
  
      // Verificamos si solo hay un producto para la tienda actual
      if (filteredForCurrentShop.length === 1) {
        addProductToCart(filteredForCurrentShop[0]);
        // Limpiamos el campo de búsqueda
        setSearchTerm('');
        // Limpiamos los productos filtrados para vaciar la lista de resultados
        setFilteredProducts([]);
      }
    }
  };  

  const groupProductsByProductName = (products) => {
    const grouped = products.reduce((acc, product) => {
      const existingGroup = acc.find((group) => group.product_name === product.product_name);
      if (existingGroup) {
        const existingCombination = existingGroup.combinations.find(
          (combination) => combination.id_product_attribute === product.id_product_attribute
        );
        if (existingCombination) {
          existingCombination.stocks.push({ shop_name: product.shop_name, quantity: product.quantity });
        } else {
          existingGroup.combinations.push({
            ...product,
            stocks: [{ shop_name: product.shop_name, quantity: product.quantity }]
          });
        }
      } else {
        acc.push({
          product_name: product.product_name,
          image_url: product.image_url,
          combinations: [
            {
              ...product,
              stocks: [{ shop_name: product.shop_name, quantity: product.quantity }]
            }
          ],
        });
      }
      return acc;
    }, []);
    return grouped;
  };

  const getStockForCurrentShop = (stocks) => {
    if (!Array.isArray(stocks) || !currentShop) {
      return 0; // Devolvemos 0 si stocks no es un array o si no hay tienda configurada
    }

    const currentShopStock = stocks.find((stock) => stock.shop_name === currentShop.shop_name);
    return currentShopStock ? currentShopStock.quantity : 0;
  };

  const addProductToCart = (product) => {
    // Si product.stocks no existe, lo creamos a partir de product.quantity y product.shop_name
    let stocks = product.stocks;
    if (!Array.isArray(stocks)) {
      stocks = [{ shop_name: product.shop_name, quantity: product.quantity }];
    }
  
    // Obtener el stock actual para la tienda en curso
    const currentShopStock = stocks.find((stock) => stock.shop_name === currentShop.shop_name);
    const stockQuantity = currentShopStock ? currentShopStock.quantity : 0;
  
    // Verificar si se permite vender sin stock
    if (!currentShop.allowOutOfStockSales && stockQuantity <= 0) {
      alert('No puedes añadir este producto porque no hay stock disponible.');
      return;
    }
  
    // Rest of the code remains the same
    const productForCart = {
      ...product,
      quantity: 1, // Añadimos una unidad
      shop_name: currentShop ? currentShop.shop_name : '',
      id_shop: currentShop ? currentShop.id_shop : '',
    };
  
    delete productForCart.stocks; // Eliminamos la propiedad stocks si existe
  
    // Llamamos a la función onAddProduct y pasamos el stockQuantity para que se maneje en el carrito
    onAddProduct(productForCart, stockQuantity, currentShop.allowOutOfStockSales, (exceedsStock) => {
      if (exceedsStock) {
        // Si se excede el stock y allowOutOfStockSales es true, mostramos el modal de confirmación
        setProductToConfirm(productForCart);
        setConfirmModalOpen(true);
      }
    });
  };
  

  const handleProductClick = (imageUrl) => {
    setSelectedProductImage(imageUrl);
    setModalOpen(true);
  };

  const handleConfirmAdd = () => {
    // Añadimos el producto aunque supere el stock
    onAddProduct(productToConfirm, null, null, null, true);
    setConfirmModalOpen(false);
    setProductToConfirm(null);
  };

  const handleCancelAdd = () => {
    setConfirmModalOpen(false);
    setProductToConfirm(null);
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
        onKeyDown={handleKeyDown}
      />
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 226px)' }}>
        <table className="min-w-full bg-white border">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="py-2 px-4 border-b text-left">Combinación</th>
              <th className="py-2 px-4 border-b text-left">Referencia</th>
              <th className="py-2 px-4 border-b text-left">Cod. Barras</th>
              <th className="py-2 px-4 border-b text-left">Precio</th>
              <th className="py-2 px-4 border-b text-left">Cantidad</th>
              <th className="py-2 px-4 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((productGroup) => (
              <React.Fragment key={productGroup.product_name}>
                <tr className="bg-gray-100">
                  <td colSpan="7" className="py-4 px-4 border-b font-bold text-lg cursor-pointer" onClick={() => handleProductClick(productGroup.image_url)}>
                    {productGroup.product_name}
                  </td>
                </tr>
                {productGroup.combinations.map((product) => (
                  <tr key={`${product.id_product}_${product.id_product_attribute}`}>
                    <td className="py-2 px-4 border-b">{product.combination_name}</td>
                    <td className="py-2 px-4 border-b">{product.reference_combination}</td>
                    <td className="py-2 px-4 border-b">{product.ean13_combination}</td>
                    <td className="py-2 px-4 border-b">{product.price.toFixed(2)} €</td>
                    <td className="py-2 px-4 border-b relative group">
                      <span>{getStockForCurrentShop(product.stocks)}</span>
                      <div className="absolute left-0 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 shadow-lg z-10">
                        {Array.isArray(product.stocks) ? (
                          product.stocks.map((stock, stockIndex) => (
                            <div key={`${stock.shop_name}_${stockIndex}`}>
                              {stock.shop_name}: {stock.quantity}
                            </div>
                          ))
                        ) : (
                          <div>No hay información de stock disponible</div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-black text-white px-4 py-2 rounded"
                        onClick={() => addProductToCart(product)}
                      >
                        Añadir
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar la imagen del producto */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <img src={selectedProductImage} alt="Imagen del producto" className="w-full h-auto" />
      </Modal>

      {/* Modal de confirmación para vender sin stock */}
      <Modal isOpen={confirmModalOpen} onClose={handleCancelAdd}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Máximo de unidades disponibles</h2>
          <p>¿Deseas vender sin stock?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCancelAdd}>
              No
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleConfirmAdd}>
              Sí
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductSearchCard;
