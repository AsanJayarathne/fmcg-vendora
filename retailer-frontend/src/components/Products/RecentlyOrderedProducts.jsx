export default function RecentlyOrderedProducts({ products = [] }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="font-bold mb-4">Recently Ordered Products</h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{product.distributor}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{product.price}</p>
              <p className="text-sm text-gray-500">Qty {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}