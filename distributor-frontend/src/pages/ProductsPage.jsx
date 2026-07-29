import { useState, useEffect, useMemo } from "react";
import CategoryFilter from "../components/product/CategoryFilter";
import ProductFilters from "../components/product/ProductFilters";
import ProductGrid from "../components/product/ProductGrid";
import ProductTable from "../components/product/ProductTable";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import ProductDetailModal from "../components/product/ProductDetailModal";
import { useAuth } from "../auth/AuthContext";
import { Package, ShoppingCart, ChartColumnBig, CreditCard, TriangleAlert, Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function ProductsPage() {
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI & View State
  const [viewMode, setViewMode] = useState("grid"); // "grid" (retailer card style) or "table"

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected product for modal view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/distributor/products.php`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products || []);
        setCategories(data.data.categories || []);
      } else {
        setError(data.message || "Failed to load products.");
      }
    } catch (err) {
      setError("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchProducts();
    }
  }, [auth?.token]);

  // Handle Save Price in Modal
  const handleSavePrice = async (product, newPrice) => {
    try {
      const res = await fetch(`${API_BASE}/distributor/products.php?id=${product.product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ price: newPrice }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts(); // Refresh list
      } else {
        throw new Error(data.message || "Failed to update price.");
      }
    } catch (err) {
      throw new Error(err.message || "Failed to communicate with server.");
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search Query Match
      const matchesSearch =
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        `PRD-${item.product_id}`.toLowerCase().includes(search.toLowerCase());

      // 2. Category Match
      const matchesCategory = selectedCategory
        ? item.category_name === selectedCategory
        : true;

      // 3. Status Evaluation
      const stock = Number(item.stock || 0);
      let status = "In Stock";
      if (stock <= 0) status = "Out Of Stock";
      else if (stock <= 50) status = "Low Stock";

      const matchesStatus = selectedStatus ? status === selectedStatus : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Metrics calculations
  const metrics = useMemo(() => {
    const lowStockCount = products.filter((p) => {
      const stock = Number(p.stock || 0);
      return stock > 0 && stock <= 50;
    }).length;

    return {
      categoriesCount: categories.length,
      lowStock: lowStockCount,
    };
  }, [products, categories]);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6">

      {/* Page Header — styled like Retailer Products Page */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Package className="inline mr-3 text-blue-600 w-8 h-8" />
        Products
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({filteredProducts.length} items)
          </span>
        )}
      </h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={products.length}
          subtitle="In Database"
          icon={<ShoppingCart size={20} />}
          color="blue"
        />

        <MetricCard
          title="Total Categories"
          value={metrics.categoriesCount}
          subtitle="Active Categories"
          icon={<ChartColumnBig size={20} />}
          color="amber"
        />

        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStock}
          subtitle="Products Need Restock"
          icon={<TriangleAlert size={20} />}
          color="red"
        />

        <MetricCard
          title="Total Credits"
          value="10,000"
          subtitle="This Month"
          icon={<CreditCard size={20} />}
          color="purple"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex justify-between items-center shadow-2xs">
          <span>⚠️ {error}</span>
          <button onClick={fetchProducts} className="underline text-red-800 cursor-pointer font-bold">Retry</button>
        </div>
      )}

      {/* Category filter horizontal pills — styled like Retailer */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(catName) => {
          setSelectedCategory(catName);
          setCurrentPage(1);
        }}
        isLoading={loading && categories.length === 0}
      />

      {/* Filter & View Switcher Bar */}
      <ProductFilters
        search={search}
        setSearch={(val) => { setSearch(val); setCurrentPage(1); }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
        categories={categories}
        selectedStatus={selectedStatus}
        setSelectedStatus={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
        onReset={handleResetFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Content View: Grid (Card style like Retailer) vs Table */}
      {viewMode === "grid" ? (
        <ProductGrid
          products={paginatedProducts}
          onViewProduct={setSelectedProduct}
          isLoading={loading}
        />
      ) : (
        <ProductTable
          products={paginatedProducts}
          onViewProduct={setSelectedProduct}
        />
      )}

      {/* Pagination */}
      {!loading && filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          label="Products"
          onPageChange={setCurrentPage}
        />
      )}

      {/* Product Detail & Edit Price Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSavePrice={handleSavePrice}
        />
      )}
    </div>
  );
}
