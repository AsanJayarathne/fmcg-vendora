import { useNavigate } from "react-router-dom";

export default function RecentOrdersStatus({ orders = [] }) {
  const displayOrders = orders.slice(0, 3);
  const navigate = useNavigate();

  const statusClass = (status) => {
    if (status === "Delivered") return "bg-green-50 text-green-600 border border-green-200/50";
    if (status === "Accepted") return "bg-emerald-50 text-emerald-600 border border-emerald-200/50";
    if (status === "Processing" || status === "Placed") return "bg-blue-50 text-blue-600 border border-blue-200/55";
    if (status === "Pending") return "bg-amber-50 text-amber-600 border border-amber-200/50";
    return "bg-red-50 text-red-600 border border-red-200/50";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-black text-slate-800 text-xl leading-tight">Recent Orders</h2>
        <button
          onClick={() => navigate("/orders")}
          className="text-sm font-bold text-blue-650 hover:text-blue-800 cursor-pointer transition"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">
        {displayOrders.map((order, idx) => (
          <div
            key={order.id}
            className={`w-full min-h-[320px] overflow-hidden rounded-[32px] p-6 transition flex flex-col justify-between ${
              idx === 0 ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-100 shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-wider ${idx === 0 ? "text-white/70" : "text-slate-400"}`}>Price</p>
                <div className={`mt-2 text-2xl font-black ${idx === 0 ? "text-white" : "text-slate-900"}`}>{order.total}</div>
                <div className={`mt-2 text-xs font-semibold ${idx === 0 ? "text-white/90" : "text-slate-500"}`}>{order.distributor ?? "No distributor"}</div>
              </div>

              <span className={`rounded-full px-3 py-1 text-[10px] font-black border ${idx === 0 ? "bg-white text-blue-600 border-white" : statusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${idx === 0 ? "text-white/70" : "text-slate-400"}`}>Payment</p>
                  <p className={`mt-2 ${idx === 0 ? "text-white" : "text-slate-950 font-black"}`}>{order.payment ?? "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-wider ${idx === 0 ? "text-white/70" : "text-slate-400"}`}>Order Placed</p>
                  <p className={`mt-2 ${idx === 0 ? "text-white" : "text-slate-950 font-black"}`}>{order.date ?? "Unknown"}</p>
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-[24px] p-4 ${idx === 0 ? "bg-white/10" : "bg-slate-50/50 border border-slate-100"}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${idx === 0 ? "text-white/70" : "text-slate-400"}`}>Order ID</p>
                  <p className={`mt-2 text-base font-black ${idx === 0 ? "text-white" : "text-slate-805"}`}>{order.id}</p>
                </div>
                {order.itemCount > 0 && (
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-wider ${idx === 0 ? "text-white/70" : "text-slate-400"}`}>Items Count</p>
                    <p className={`mt-2 text-base font-black ${idx === 0 ? "text-white" : "text-slate-805"}`}>{order.itemCount}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}