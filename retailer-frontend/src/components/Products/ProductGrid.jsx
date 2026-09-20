import ProductCard from "./ProductCard";
import { useLanguage } from "../../context/LanguageContext";

function ProductGrid({ products, onView, onCart, isLoading }) {
  const { t } = useLanguage();

  // Loading skeleton - matches responsive grid layout
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 p-4 sm:p-5 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-xl mb-3" />
            <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
        <p className="text-4xl mb-2">🔍</p>
        <p className="font-bold text-sm sm:text-base text-slate-800">{t("products.noProductsFound", "No products found")}</p>
        <p className="text-xs text-slate-400 mt-1">{t("products.noProductsSubtitle", "Try selecting a different category or search keyword")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => {
        const key = `${product.product_id ?? product.id}-${product.distributor_id}`;
        return (
          <ProductCard
            key={key}
            product={product}
            onView={onView}
            onCart={onCart}
          />
        );
      })}
    </div>
  );
}

export default ProductGrid;