import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import ProductStatCards from "../components/ProductStatCards";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/Tables/ProductTable";
import Pagination from "../components/Pagination";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { Package, Plus } from "lucide-react";

const PRODUCTS_API = "http://localhost/fmcg-vendora/backend/api/admin/products.php";
const STOCK_API    = "http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php";

const ProductsPage = () => {
  const { auth } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct]   = useState(null);
  const [refreshKey, setRefreshKey]     = useState(0);

  const [products, setProducts]             = useState([]);
  const [warehouseStock, setWarehouseStock] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus]     = useState("all");
  const [sortBy, setSortBy]                     = useState("newest");
  const [search, setSearch]                     = useState("");
  const [currentPage, setCurrentPage]           = useState(1);
  const itemsPerPage = 10;

  const fetchCatalogData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${auth?.token}` };
      const [prodRes, stockRes] = await Promise.all([
        fetch(PRODUCTS_API, { headers }),
        fetch(STOCK_API, { headers }),
      ]);

      const prodJson  = await prodRes.json();
      const stockJson = await stockRes.json();

      if (!prodJson.success) throw new Error(prodJson.message || "Failed to load products");
      if (!stockJson.success) throw new Error(stockJson.message || "Failed to load warehouse stock");

      setProducts(prodJson.data || []);
      setWarehouseStock(stockJson.data || []);
    } catch (err) {
      setError(err.message || "Network error — could not reach the server");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth?.token) {
      fetchCatalogData();
    }
  }, [auth?.token, refreshKey, fetchCatalogData]);

  const handleProductAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleProductUpdated = () => {
    setRefreshKey((k) => k + 1);
  };

  const totalProducts  = products.length;
  const activeListings = products.filter((p) => p.status === "Active").length;
  const lowStockAlerts = warehouseStock.filter((item) => item.quantity <= 50).length;

  const categoriesList = useMemo(() => {
    return [...new Set(products.map((p) => p.category_name).filter(Boolean))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const code = `PRD-${String(p.product_id).padStart(3, "0")}`;
      const matchesSearch =
        p.product_name.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "all" || p.category_name === selectedCategory;
      const matchesStatus   = selectedStatus === "all" || p.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price_high") {
        return (parseFloat(b.base_price) || 0) - (parseFloat(a.base_price) || 0);
      }
      if (sortBy === "price_low") {
        return (parseFloat(a.base_price) || 0) - (parseFloat(b.base_price) || 0);
      }
      if (sortBy === "newest") {
        return b.product_id - a.product_id;
      }
      return 0;
    });
  }, [filteredProducts, sortBy]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <Package className="inline mr-3 text-blue-600 w-8 h-8" />
          Products Catalog
          {!loading && (
            <span className="ml-3 text-base font-normal text-slate-500">
              ({sortedProducts.length} items)
            </span>
          )}
        </h1>

        <button
          id="add-product-btn"
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* Metric Cards */}
      <ProductStatCards
        total={totalProducts}
        active={activeListings}
        lowStock={lowStockAlerts}
        loading={loading}
      />

      {/* Filters & Search */}
      <ProductFilters
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
        selectedStatus={selectedStatus}
        onStatusChange={(stat) => { setSelectedStatus(stat); setCurrentPage(1); }}
        sortBy={sortBy}
        onSortChange={(sort) => { setSortBy(sort); setCurrentPage(1); }}
        search={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        onReset={() => {
          setSelectedCategory("all");
          setSelectedStatus("all");
          setSortBy("newest");
          setSearch("");
          setCurrentPage(1);
        }}
      />

      {/* Products Table */}
      <ProductTable
        products={paginatedProducts}
        loading={loading}
        error={error}
        onEditProduct={(p) => setEditProduct(p)}
      />

      {/* Pagination */}
      {!loading && sortedProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={sortedProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          label="products"
        />
      )}

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
