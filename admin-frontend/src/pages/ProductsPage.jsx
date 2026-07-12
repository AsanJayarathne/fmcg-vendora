import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import ProductStatCards from '../components/ProductStatCards';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/Tables/ProductTable';
import Pagination from '../components/Pagination';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';

const PRODUCTS_API = 'http://localhost/fmcg-vendora/backend/api/admin/products.php';
const STOCK_API    = 'http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php';

const ProductsPage = () => {
  const { auth } = useAuth();
  const [showAddModal, setShowAddModal]     = useState(false);
  const [editProduct, setEditProduct]       = useState(null);   // product object to edit
  const [refreshKey, setRefreshKey]         = useState(0);

  const [products, setProducts]             = useState([]);
  const [warehouseStock, setWarehouseStock] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');

  const fetchCatalogData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${auth?.token}` };
      const [prodRes, stockRes] = await Promise.all([
        fetch(PRODUCTS_API, { headers }),
        fetch(STOCK_API, { headers })
      ]);

      const prodJson = await prodRes.json();
      const stockJson = await stockRes.json();

      if (!prodJson.success) throw new Error(prodJson.message || 'Failed to load products');
      if (!stockJson.success) throw new Error(stockJson.message || 'Failed to load warehouse stock');

      setProducts(prodJson.data);
      setWarehouseStock(stockJson.data);
    } catch (err) {
      setError(err.message || 'Network error — could not reach the server');
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth?.token) {
      fetchCatalogData();
    }
  }, [auth?.token, refreshKey, fetchCatalogData]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus]     = useState('all');
  const [sortBy, setSortBy]                     = useState('newest');

  const handleProductAdded = () => {
    setRefreshKey(k => k + 1);
  };

  const handleProductUpdated = () => {
    // re-fetch catalog data after a successful update
    setRefreshKey(k => k + 1);
  };

  const totalProducts = products.length;
  const activeListings = products.filter(p => p.status === 'Active').length;
  const lowStockAlerts = warehouseStock.filter(item => item.quantity <= 50).length;

  const categoriesList = [...new Set(products.map(p => p.category_name))].sort();

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category_name === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_high') {
      return (parseFloat(b.base_price) || 0) - (parseFloat(a.base_price) || 0);
    }
    if (sortBy === 'price_low') {
      return (parseFloat(a.base_price) || 0) - (parseFloat(b.base_price) || 0);
    }
    if (sortBy === 'newest') {
      return b.product_id - a.product_id;
    }
    return 0;
  });

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Products Catalog</h1>
        <button
          id="add-product-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </button>
      </div>

      <ProductStatCards
        total={totalProducts}
        active={activeListings}
        lowStock={lowStockAlerts}
        loading={loading}
      />
      <ProductFilters
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ProductTable
        products={sortedProducts}
        loading={loading}
        error={error}
        onEditProduct={p => setEditProduct(p)}
      />
      <Pagination />

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default ProductsPage;
