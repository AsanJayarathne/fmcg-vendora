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

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">{product.distributor}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{product.price}</p>
              <p className="text-sm text-slate-500 mb-2">Qty {product.quantity}</p>
              <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}