import React, { useState } from 'react';

// Productos simulados
const products = [
    { id: 7032, id_product_attribute: 23114, name: 'Cinturilla De Látex Larga Mia Negra 3XS', reference: 'Mia', barcode: '2120953946410', price: 59.88, quantity: 9 },
    { id: 7032, id_product_attribute: 23115, name: 'Cinturilla De Látex Larga Mia Negra 2XS', reference: 'Mia', barcode: '2306084483288', price: 59.82, quantity: 8 },
    { id: 7032, id_product_attribute: 23116, name: 'Cinturilla De Látex Larga Mia Negra XS', reference: 'Mia', barcode: '1422219141821', price: 59.88, quantity: 9 },
    { id: 7032, id_product_attribute: 23117, name: 'Cinturilla De Látex Larga Mia Negra S', reference: 'Mia', barcode: '4474081744546', price: 59.91, quantity: 11 },
    { id: 7032, id_product_attribute: 23118, name: 'Cinturilla De Látex Larga Mia Negra M', reference: 'Mia', barcode: '3400148570422', price: 59.88, quantity: 9 },
    { id: 7032, id_product_attribute: 23119, name: 'Cinturilla De Látex Larga Mia Negra L', reference: 'Mia', barcode: '9362072914298', price: 59.91, quantity: 8 },
    { id: 7032, id_product_attribute: 23120, name: 'Cinturilla De Látex Larga Mia Negra XL', reference: 'Mia', barcode: '1097585971725', price: 59.88, quantity: 8 },
    { id: 7032, id_product_attribute: 23121, name: 'Cinturilla De Látex Larga Mia Negra 2XL', reference: 'Mia', barcode: '8878412710358', price: 59.91, quantity: 8 },
    { id: 7032, id_product_attribute: 23122, name: 'Cinturilla De Látex Larga Mia Negra 3XL', reference: 'Mia', barcode: '6454621644473', price: 60.00, quantity: 4 },
    { id: 7032, id_product_attribute: 23123, name: 'Cinturilla De Látex Larga Mia Negra 4XL', reference: 'Mia', barcode: '1043576951047', price: 59.91, quantity: 1 },
    { id: 7032, id_product_attribute: 23124, name: 'Cinturilla De Látex Larga Mia Beige 3XS', reference: 'Mia', barcode: '1366216777419', price: 60.00, quantity: 4 },
    { id: 7032, id_product_attribute: 23125, name: 'Cinturilla De Látex Larga Mia Beige 2XS', reference: 'Mia', barcode: '4876884515482', price: 59.94, quantity: 4 },
    { id: 7032, id_product_attribute: 23126, name: 'Cinturilla De Látex Larga Mia Beige XS', reference: 'Mia', barcode: '8283790172931', price: 60.00, quantity: 3 },
    { id: 7032, id_product_attribute: 23127, name: 'Cinturilla De Látex Larga Mia Beige S', reference: 'Mia', barcode: '4612387567357', price: 59.94, quantity: 4 },
    { id: 7032, id_product_attribute: 23128, name: 'Cinturilla De Látex Larga Mia Beige M', reference: 'Mia', barcode: '7575661890497', price: 60.00, quantity: 3 },
    { id: 7032, id_product_attribute: 23129, name: 'Cinturilla De Látex Larga Mia Beige L', reference: 'Mia', barcode: '5981689075754', price: 59.88, quantity: 6 },
    { id: 7032, id_product_attribute: 23130, name: 'Cinturilla De Látex Larga Mia Beige XL', reference: 'Mia', barcode: '7279306239176', price: 59.91, quantity: 10 },
    { id: 7032, id_product_attribute: 23131, name: 'Cinturilla De Látex Larga Mia Beige 2XL', reference: 'Mia', barcode: '3516252400835', price: 60.00, quantity: 5 },
    { id: 7032, id_product_attribute: 23132, name: 'Cinturilla De Látex Larga Mia Beige 3XL', reference: 'Mia', barcode: '6474914579121', price: 60.00, quantity: 2 },
    { id: 7032, id_product_attribute: 23133, name: 'Cinturilla De Látex Larga Mia Beige 4XL', reference: 'Mia', barcode: '3170165165818', price: 59.91, quantity: 2 },
    { id: 7032, id_product_attribute: 25597, name: 'Cinturilla De Látex Larga Mia Negra 4XS', reference: 'Mia', barcode: '2286690069086', price: 59.94, quantity: 5 }
];

const ProductSearchCardForTransfer = ({ onAddProduct, onMultipleResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length >= 3) {
      const result = products.filter((product) =>
        product.barcode.includes(term)
      );
      
      if (result.length === 1) {
        // Si se encuentra un solo producto, lo añadimos directamente
        onAddProduct(result[0]);
        setSearchTerm('');  // Limpiar el campo de búsqueda
      } else if (result.length > 1) {
        // Si se encuentran varios productos, se abre el modal de selección
        onMultipleResults(result);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Buscar Producto</h2>
      <input
        type="text"
        placeholder="Buscar por EAN13..."
        className="border rounded p-2 w-full mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default ProductSearchCardForTransfer;
