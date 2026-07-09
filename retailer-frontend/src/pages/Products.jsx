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
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);

  // ── UI state ─────────────────────────────────────────────────
  const [searchTerm,         setSearchTerm]         = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // null = All
  const [selectedProduct,    setSelectedProduct]    = useState(null);
  const [cartProduct,        setCartProduct]        = useState(null);

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
      .then(({ products: prods, categories: cats }) => {
        setProducts(prods);
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

  // ── Client-side search filter ─────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const name = (p.product_name ?? p.name ?? "").toLowerCase();
      return name.includes(term);
    });
  }, [products, searchTerm]);

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
            products={products}
            onView={setSelectedProduct}
            onCart={setCartProduct}
          />
          <RecommendedProducts
            products={products}
            onView={setSelectedProduct}
            onCart={setCartProduct}
          />
        </>
      )}

      {/* Section heading */}
      <h2 className="text-xl font-bold mb-6">
        {headingText}
      </h2>

      {/* Search bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

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
