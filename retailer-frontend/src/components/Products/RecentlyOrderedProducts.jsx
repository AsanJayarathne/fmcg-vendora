export default function RecentlyOrderedProducts({ products = [] }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-black text-slate-800 text-base leading-tight">Recent Ordered Items</h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">Quick lookup of recently purchased items</p>
        </div>
        <button className="rounded-full bg-slate-50 border border-slate-100 px-4.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3"
          >
            <div className="min-w-0 pr-2">
              <p className="font-extrabold text-sm text-slate-800 truncate">{product.name}</p>
              <p className="text-[11px] text-slate-450 font-semibold">{product.distributor}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-xs text-slate-900">{product.price}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Qty {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}