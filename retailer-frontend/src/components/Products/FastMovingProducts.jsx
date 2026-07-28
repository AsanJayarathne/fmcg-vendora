const defaultFastProducts = [
  { name: "Anchor Milk Powder 400g", orders: 145, growth: "+22%", trend: "up" },
  { name: "Sunlight Care Soap 100g", orders: 122, growth: "+16%", trend: "up" },
  { name: "Lifebuoy Total 100g", orders: 110, growth: "+12%", trend: "up" },
  { name: "Pepsi Soft Drink 1.5L", orders: 95, growth: "+9%", trend: "up" },
  { name: "Tide Washing Powder 1kg", orders: 80, growth: "+5%", trend: "up" },
];

export default function FastMovingProducts({ products }) {
  const displayList = Array.isArray(products) && products.length > 0 ? products : defaultFastProducts;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-800 text-base leading-tight">
              Fast Moving Products
            </h2>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Highest order velocity items over time
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-100/80 px-3 py-1 text-emerald-600 text-xs font-medium">
            High Velocity
          </span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-1 font-semibold">Rank & Product</th>
                <th className="pb-3 text-center font-semibold">Orders</th>
                <th className="pb-3 text-right pr-1 font-semibold">Growth Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayList.map((item, idx) => (
                <tr key={item.name + idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0 ? "bg-amber-100 text-amber-700" :
                        idx === 1 ? "bg-slate-100 text-slate-700" :
                        idx === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-sm text-slate-800 truncate max-w-[180px]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center text-xs font-semibold text-slate-700">
                    {item.orders}
                  </td>
                  <td className="py-3 text-right pr-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-2.5 py-0.5 text-xs font-medium border border-emerald-100/60">
                      {item.growth ?? "+10%"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}