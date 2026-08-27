import { useNavigate } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiArrowRight, FiRepeat } from "react-icons/fi";

export default function RecentlyOrderedProducts({ products = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 border-b border-slate-50 pb-4">
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Recent Ordered Items</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Quick lookup of recently purchased items</p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 transition cursor-pointer shrink-0"
          >
            Catalog
          </button>
        </div>

        {/* Product Items List */}
        <div className="mt-4 space-y-2.5">
          {products.length === 0 ? (
            <div className="py-10 text-center text-slate-400 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
                <FiPackage size={22} />
              </div>
              <p className="text-xs font-bold text-slate-600">No ordered products yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Start placing orders to see recent items here</p>
            </div>
          ) : (
            products.slice(0, 4).map((product, idx) => (
              <div
                key={product.id || idx}
                className="flex items-center justify-between rounded-2xl border border-slate-100/80 bg-slate-50/50 hover:bg-slate-50 p-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <FiPackage size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-800 truncate">{product.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{product.distributor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-xs text-blue-600">{product.price}</p>
                    <span className="inline-block text-[10px] font-bold text-slate-500 bg-white border border-slate-200/80 px-1.5 py-0.2 rounded-md">
                      Qty: {product.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/products")}
                    className="p-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200/80 transition cursor-pointer"
                    title="Order Again"
                  >
                    <FiRepeat size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer CTA Strip */}
      <div className="mt-6 pt-4 border-t border-slate-50">
        <button
          onClick={() => navigate("/products")}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-xs rounded-2xl transition shadow-md shadow-blue-600/15 flex items-center justify-between gap-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiShoppingBag size={14} />
            <span>Browse Full Product Catalog</span>
          </div>
          <FiArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}