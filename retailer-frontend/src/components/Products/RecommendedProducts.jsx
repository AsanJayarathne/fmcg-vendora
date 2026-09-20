import { useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiThumbsUp } from "react-icons/fi";
import ProductCard from "./ProductCard";

function RecommendedProducts({ products, onView, onCart, onViewAll }) {
  const scrollRef = useRef(null);

  const recommended = products
    .filter((p) => (p.available_qty ?? p.stock ?? 0) > 0)
    .slice(0, 6);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (recommended.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-10 min-w-0">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiThumbsUp className="text-blue-600" />
            <span>Recommended For You</span>
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Handpicked items based on store history</p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Scroll Left"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Scroll Right"
            aria-label="Scroll right"
          >
            <FiChevronRight size={16} />
          </button>

          {/* View All Button */}
          <button
            type="button"
            onClick={onViewAll}
            className="rounded-full bg-blue-50 border border-blue-100 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-100 transition cursor-pointer shadow-2xs shrink-0"
          >
            View All
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 no-scrollbar scroll-smooth touch-pan-x"
      >
        {recommended.map((product) => {
          const key = `${product.product_id ?? product.id}-${product.distributor_id}`;
          return (
            <div key={key} className="w-[240px] sm:w-[270px] shrink-0">
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

export default RecommendedProducts;
