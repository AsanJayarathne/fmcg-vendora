import React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";

const LowStockAlertsTable = () => {
  const alertItems = [
    { name: "Anchor Full Cream Milk Powder (400g)", current: 12, min: 100, status: "Critical" },
    { name: "Munchee Super Cream Cracker (500g)", current: 28, min: 150, status: "Low" },
    { name: "Maliban Gold Marie (80g)", current: 10, min: 200, status: "Critical" },
    { name: "Siddhalepa Herbal Balm (50g)", current: 45, min: 120, status: "Low" },
    { name: "Clogard Natural Clove Toothpaste (120g)", current: 0, min: 180, status: "Out of Stock" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Low Stock Alerts</h2>
            <p className="text-[10px] font-semibold text-slate-400">Inventory items needing reorder</p>
          </div>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer">
          See All <ChevronRight size={14} />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-2xs bg-white">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-right">Current</th>
                <th className="px-4 py-3 text-right">Min Stock</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alertItems.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="px-4 py-3 font-bold text-slate-800 max-w-[200px] truncate">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-bold ${item.current === 0 ? "text-rose-600" : "text-amber-600"}`}>
                      {item.current} units
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-500">
                    {item.min} units
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition cursor-pointer shadow-2xs">
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlertsTable;
