import { useNavigate } from "react-router-dom";

export default function RecentlyOrderedProducts({ products = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight">Recent Ordered Items</h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Quick lookup of recently purchased items</p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="rounded-full bg-blue-50/60 border border-blue-100/50 px-4.5 py-1.5 text-xs font-black uppercase tracking-wider text-blue-600 hover:bg-blue-100/75 cursor-pointer transition"
        >
          View all
        </button>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-3"
          >
            <div className="min-w-0 pr-2">
              <p className="font-semibold text-sm text-slate-800 truncate">{product.name}</p>
              <p className="text-[11px] text-slate-400 font-normal">{product.distributor}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-xs text-blue-600">{product.price}</p>
              <p className="text-[10px] text-slate-400 font-normal mt-0.5">Qty {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}