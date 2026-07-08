import React, { useState } from 'react';
import ProductStatCards from '../components/ProductStatCards';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/Tables/ProductTable';
import Pagination from '../components/Pagination';
import AddProductModal from '../components/AddProductModal';

const ProductsPage = () => {
  const [showModal, setShowModal]   = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    // bump key to trigger re-fetch in ProductTable
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Products Catalog</h1>
        <button
          id="add-product-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </button>
      </div>

      <ProductStatCards />
      <ProductFilters />
      <ProductTable refreshKey={refreshKey} />
      <Pagination />

      {/* Add Product Modal */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
};

export default ProductsPage;
