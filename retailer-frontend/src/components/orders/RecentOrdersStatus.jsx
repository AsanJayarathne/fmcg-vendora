export default function RecentOrdersStatus({ orders = [] }) {
  const displayOrders = [...orders]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : null;
      const dateB = b.date ? new Date(b.date) : null;
      if (dateA && dateB) return dateB - dateA;
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;
      return 0;
    })
    .slice(0, 3);

  const statusClass = (status) => {
    if (status === "Delivered") return "bg-green-500 text-white";
    if (status === "Confirmed") return "bg-white text-blue-800 ring-1 ring-white";
    if (status === "Processing") return "bg-yellow-100 text-yellow-800";
    if (status === "Pending") return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Recent Orders</h2>
        <button className="text-sm font-semibold text-slate-500 hover:text-slate-900">See All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayOrders.map((order, idx) => (
          <div
            key={order.id}
            className={`overflow-hidden rounded-[32px] p-6 shadow-xl ${
              idx === 0 ? "bg-blue-700 text-white" : "bg-slate-100"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-sm uppercase tracking-[0.18em] ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>Price</p>
                <div className={`mt-3 text-3xl font-bold ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.total}</div>
                <div className={`mt-3 text-sm ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>{order.distributor ?? order.updated ?? "No distributor"}</div>
              </div>

              <span className={`rounded-full px-4 py-1 text-sm font-semibold ${statusClass(order.status)} ${idx === 0 ? "bg-white text-blue-700" : "bg-green-500 text-white"}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>Payment</p>
                  <p className={`mt-2 font-semibold ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.payment ?? "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>Order Placed</p>
                  <p className={`mt-2 font-semibold ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.date ?? order.updated ?? "Unknown"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className={`text-xs ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>Items</p>
                  <p className={`mt-2 font-semibold ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.quantity ?? order.items?.length ?? order.itemCount ?? "—"}</p>
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-[28px] p-5 ${idx === 0 ? "bg-white/10" : "bg-white"}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-xs ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>Order No</p>
                  <p className={`mt-2 text-lg font-bold ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.id}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${idx === 0 ? "text-white/80" : "text-slate-500"}`}>No of Items</p>
                  <p className={`mt-2 text-lg font-semibold ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.quantity ?? order.items ?? "20"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 