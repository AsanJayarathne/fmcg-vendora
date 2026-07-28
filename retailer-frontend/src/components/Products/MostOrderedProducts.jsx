const defaultProducts = [
  { name: "Anchor Milk Powder 400g", value: 145 },
  { name: "Sunlight Care Soap 100g", value: 122 },
  { name: "Lifebuoy Total 100g", value: 110 },
  { name: "Pepsi Soft Drink 1.5L", value: 95 },
  { name: "Tide Washing Powder 1kg", value: 80 },
];

export default function MostOrderedProducts({ products }) {
  const displayProducts = Array.isArray(products) && products.length > 0 ? products : defaultProducts;
  const maxVal = Math.max(...displayProducts.map((p) => p.value || 1), 1);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-800 text-base leading-tight">
              Most Ordered Products
            </h2>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Volume distribution across top items
            </p>
          </div>
          <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-medium">
            Top Demand
          </span>
        </div>

        <div className="space-y-4">
          {displayProducts.map((product) => {
            const pct = Math.min(100, Math.max(8, (product.value / maxVal) * 100));
            return (
              <div key={product.name}>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-slate-700 font-semibold truncate max-w-[200px]">{product.name}</span>
                  <span className="text-slate-500">{product.value} units</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}