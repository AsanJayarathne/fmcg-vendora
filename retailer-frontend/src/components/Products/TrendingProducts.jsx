import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";

function TrendingProducts({ products, onView, onCart, onViewAll }) {
  const scrollRef = useRef(null);

  // Real API: sort by stock, take top 6. Mock data: use fastMoving flag
  const hasMockData = products.some((p) => "fastMoving" in p);

  const trendingProducts = hasMockData
    ? products.filter((p) => p.fastMoving)
    : [...products]
        .sort((a, b) => (b.available_qty ?? 0) - (a.available_qty ?? 0))
        .slice(0, 6);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (trendingProducts.length === 0) return null;

  return (
    <div className="mb-10 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Trending Products
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Top performing inventory in demand</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs hover:border-slate-300"
            title="Scroll Left"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs hover:border-slate-300"
            title="Scroll Right"
          >
            <FiChevronRight size={16} />
          </button>

          {/* View All Button */}
          <button
            onClick={onViewAll}
            className="rounded-full bg-blue-50/80 border border-blue-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition shadow-2xs"
          >
            View All
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
      >
        {trendingProducts.map((product) => {
          const key = `${product.product_id ?? product.id}-${product.distributor_id}`;
          return (
            <div key={key} className="min-w-[280px]">
              <ProductCard
                product={product}
                onView={onView}
                onCart={onCart}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrendingProducts;
