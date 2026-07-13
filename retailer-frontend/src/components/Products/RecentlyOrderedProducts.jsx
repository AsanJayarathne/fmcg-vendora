export default function RecentlyOrderedProducts({ products = [] }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-lg">Recent Ordered Items</h2>
          <p className="text-sm text-slate-500">Quick reorder options for top products</p>
        </div>
        <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
          View all
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex min-w-[140px] flex-1 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">Qty {product.quantity}</p>
            </div>
            <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
              Reorder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}