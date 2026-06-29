import React from 'react';

const LowStockAlertsTable = () => {
  return (
    <div className="bg-[#f2f4fa] rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900">Law Stock Alerts</h2>
        <a href="#" className="text-sm font-bold text-slate-900 hover:underline">See All</a>
      </div>
      
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-900 font-bold">
          <tr>
            <th className="pb-3 px-2">Product</th>
            <th className="pb-3 px-2">Current Stock</th>
            <th className="pb-3 px-2">Min Stock</th>
            <th className="pb-3 px-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {[
            { name: 'Item 1', current: 100, min: 500 },
            { name: 'Item 2', current: 300, min: 350 },
            { name: 'Item 3', current: 10, min: 250 },
            { name: 'Item 4', current: 25, min: 300 },
            { name: 'Item 5', current: 0, min: 400 },
          ].map((item, index) => (
            <tr key={index} className="border-t border-slate-200">
              <td className="py-2.5 px-2 bg-white/40 font-medium rounded-l-md my-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">{item.name}</td>
              <td className="py-2.5 px-2 bg-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">{item.current}</td>
              <td className="py-2.5 px-2 bg-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">{item.min}</td>
              <td className="py-2.5 px-2 bg-white/40 rounded-r-md text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <button className="bg-red-200 text-red-500 font-semibold text-xs px-3 py-1 rounded-full hover:bg-red-300 transition-colors">
                  Reorder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style dangerouslySetInnerHTML={{__html: `
        table { border-collapse: separate; border-spacing: 0 4px; }
        tr td:first-child { border-top-left-radius: 6px; border-bottom-left-radius: 6px; }
        tr td:last-child { border-top-right-radius: 6px; border-bottom-right-radius: 6px; }
      `}} />
    </div>
  );
};

export default LowStockAlertsTable;
