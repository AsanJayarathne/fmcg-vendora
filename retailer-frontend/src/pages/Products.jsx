import { useContext, useState } from "react";
import {FiShoppingBag} from "react-icons/fi";
import products from "../data/products";
import { CartContext } from "../context/CartContextObject";
import SearchBar from "../components/products/SearchBar";
import CategoryFilter from "../components/products/CategoryFilter";
import ProductGrid from "../components/products/ProductGrid";
import TrendingProducts from "../components/products/TrendingProducts";
import RecommendedProducts from "../components/products/RecommendedProducts";
import ProductDetailsModal from "../components/products/ProductDetailsModal";
import AddToCartModal from "../components/products/AddToCartModal";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);

  const { addToCart } = useContext(CartContext);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        <FiShoppingBag className="inline mr-2" />
        Products
      </h1>


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

      <h2 className="text-xl font-bold mb-6">
        All Products
      </h2>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ProductGrid
        products={filteredProducts}
        onView={setSelectedProduct}
        onCart={setCartProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <AddToCartModal
        product={cartProduct}
        onClose={() => setCartProduct(null)}
        onConfirm={addToCart}
      />
    </div>
  );
}

export default Products;
