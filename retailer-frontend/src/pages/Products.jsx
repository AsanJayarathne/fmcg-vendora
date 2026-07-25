import { useContext, useState, useEffect, useMemo } from "react";
import { FiShoppingBag } from "react-icons/fi";

import { CartContext } from "../context/CartContextObject";
import { useAuth }     from "../context/AuthContext";
import { fetchProductsWithCategories } from "../services/productService";

// Use exact folder casing: components/Products (capital P)
import SearchBar           from "../components/Products/SearchBar";
import CategoryFilter      from "../components/Products/CategoryFilter";
import ProductGrid         from "../components/Products/ProductGrid";
import TrendingProducts    from "../components/Products/TrendingProducts";
import RecommendedProducts from "../components/Products/RecommendedProducts";
import ProductDetailsModal from "../components/Products/ProductDetailsModal";
import AddToCartModal      from "../components/Products/AddToCartModal";

function Products() {
  const { auth }      = useAuth();
  const { addToCart } = useContext(CartContext);

  // ── Data state ────────────────────────────────────────────────
  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [distributors, setDistributors] = useState([]);

  // ── UI state ─────────────────────────────────────────────────
  const [selectedDistributorId, setSelectedDistributorId] = useState(""); // "" = All
  const [searchTerm,            setSearchTerm]            = useState("");
  const [selectedCategoryId,    setSelectedCategoryId]    = useState(null); // null = All
  const [selectedProduct,       setSelectedProduct]       = useState(null);
  const [cartProduct,           setCartProduct]           = useState(null);

  // ── Loading & error state ─────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Token extracted to a stable variable so useEffect dep is a primitive
  const token = auth?.token ?? null;

  // ── Fetch products + categories together ──────────────────────
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchProductsWithCategories(token, selectedCategoryId)
      .then(({ products: prods, categories: cats, distributors: dists }) => {
        setProducts(prods.map(p => ({
          ...p,
          distributor_id: Number(p.distributor_id),
          unit_price: Number(p.unit_price),
          available_qty: Number(p.available_qty)
        })));
        setDistributors(dists || []);
        // Only update categories on first load (All) to keep filter pills stable
        if (!selectedCategoryId) {
          setCategories(cats);
        }
      })
      .catch((err) => {
        console.error("Products fetch error:", err);
        setError(err.message || "Failed to load products. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [token, selectedCategoryId]);

  // ── Client-side filter ─────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedDistributorId) {
      result = result.filter(p => p.distributor_id === Number(selectedDistributorId));
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => {
        const name = (p.product_name ?? p.name ?? "").toLowerCase();
        return name.includes(term);
      });
    }
    return result;
  }, [products, selectedDistributorId, searchTerm]);

  // ── Category change handler ────────────────────────────────────
  function handleCategorySelect(categoryId) {
    setSelectedCategoryId(categoryId);
    setSearchTerm(""); // clear search when switching category
  }

  // Heading text
  const headingText = selectedCategoryId
    ? (categories.find((c) => c.category_id === selectedCategoryId)?.category_name ?? "Products")
    : searchTerm
      ? `Results for "${searchTerm}"`
      : "All Products";

  return (
    <div className="min-w-0 overflow-x-hidden">

      {/* Page header — original style */}
      <h1 className="text-3xl font-bold mb-6">
        <FiShoppingBag className="inline mr-2" />
        Products
        {!loading && (
          <span className="ml-3 text-base font-normal text-gray-500">
            ({filteredProducts.length} items)
          </span>
        )}
      </h1>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 font-medium text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Trending & Recommended — shown only on the unfiltered All view */}
      {!selectedCategoryId && !searchTerm && !loading && products.length > 0 && (
        <>
          <TrendingProducts
            products={products.filter(p => !selectedDistributorId || p.distributor_id === Number(selectedDistributorId))}
            onView={setSelectedProduct}
            onCart={setCartProduct}
          />
          <RecommendedProducts
            products={products.filter(p => !selectedDistributorId || p.distributor_id === Number(selectedDistributorId))}
            onView={setSelectedProduct}
            onCart={setCartProduct}
          />
        </>
      )}

      {/* Section heading */}
      <h2 className="text-xl font-bold mb-6">
        {headingText}
      </h2>

      {/* Search and Distributor Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-white text-xs font-bold transition duration-300 shadow-2xs placeholder-slate-400 text-slate-700"
          />
        </div>
        {!loading && distributors.length > 0 && (
          <div className="w-full md:w-64">
            <select
              value={selectedDistributorId}
              onChange={(e) => setSelectedDistributorId(e.target.value)}
              className="w-full border border-slate-200 focus:border-blue-500 rounded-full px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-white text-xs font-bold transition duration-300 shadow-2xs appearance-none cursor-pointer text-slate-500"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 1.25rem center',
                backgroundSize: '1.25em 1.25em',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <option value="">All Distributors</option>
              {distributors.map((d) => (
                <option key={d.distributor_id} value={d.distributor_id}>
                  {d.company_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Category filter pills */}
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={handleCategorySelect}
        isLoading={loading && categories.length === 0}
      />

      {/* Product grid */}
      <ProductGrid
        products={filteredProducts}
        onView={setSelectedProduct}
        onCart={setCartProduct}
        isLoading={loading}
      />

      {/* Product details modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Add to cart modal (triggered from ProductCard "Add to Cart" button) */}
      <AddToCartModal
        product={cartProduct}
        onClose={() => setCartProduct(null)}
        onConfirm={addToCart}
      />
    </div>
  );
}

export default Products;
