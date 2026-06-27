import React from 'react';

const WarehouseTable = () => {
  const data = [
    { id: 'ORD-01', name: 'Item 1', category: 'A', basePrice: '45.00', mrp: '65.00', stock: 500, status: 'In Stock' },
    { id: 'ORD-02', name: 'Item 2', category: 'B', basePrice: '45.00', mrp: '65.00', stock: 500, status: 'In Stock' },
    { id: 'ORD-03', name: 'Item 3', category: 'A', basePrice: '45.00', mrp: '65.00', stock: 50, status: 'Low Stock' },
    { id: 'ORD-04', name: 'Item 4', category: 'D', basePrice: '45.00', mrp: '65.00', stock: 500, status: 'In Stock' },
    { id: 'ORD-05', name: 'Item 5', category: 'C', basePrice: '45.00', mrp: '65.00', stock: 500, status: 'In Stock' },
    { id: 'ORD-06', name: 'Item 6', category: 'B', basePrice: '45.00', mrp: '65.00', stock: 0, status: 'Out Of Stock' },
    { id: 'ORD-07', name: 'Item 7', category: 'A', basePrice: '90.00', mrp: '110.00', stock: 250, status: 'In Stock' },
    { id: 'ORD-08', name: 'Item 8', category: 'B', basePrice: '45.00', mrp: '65.00', stock: 500, status: 'In Stock' },
    { id: 'ORD-09', name: 'Item 9', category: 'C', basePrice: '45.00', mrp: '65.00', stock: 400, status: 'In Stock' },
    { id: 'ORD-10', name: 'Item 10', category: 'C', basePrice: '45.00', mrp: '65.00', stock: 150, status: 'In Stock' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'text-green-500';
      case 'Low Stock': return 'text-orange-500';
      case 'Out Of Stock': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-4 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          
          <select className="px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800">
            <option>All Categories</option>
          </select>
          
          <select className="px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800">
            <option>Status</option>
          </select>
          
          <select className="px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800">
            <option>Stock Availability</option>
          </select>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md bg-white font-bold text-slate-800 hover:bg-slate-50 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-10.02l5.67-5.67"/>
          </svg>
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-900 font-bold border-b border-slate-200 bg-white">
            <tr>
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Base Price(LKR)</th>
              <th className="py-4 px-6">MRP(LKR)</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {data.map((item, index) => (
              <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors bg-white">
                <td className="py-3 px-6">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.id}</div>
                </td>
                <td className="py-3 px-6 font-medium text-slate-800">{item.category}</td>
                <td className="py-3 px-6 font-medium text-slate-800">{item.basePrice}</td>
                <td className="py-3 px-6 font-medium text-slate-800">{item.mrp}</td>
                <td className="py-3 px-6">
                  <div className="font-semibold text-slate-800">{item.stock}</div>
                  <div className={`text-xs font-bold ${getStatusColor(item.status)}`}>{item.status}</div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1 border border-slate-800 rounded text-slate-800 font-bold text-xs hover:bg-slate-100 transition">
                      Update Stock
                    </button>
                    <button className="w-7 h-7 rounded border border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-xs font-semibold text-slate-500">
            showing 1 to 8 of 178 Products
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50">3</button>
            
            <span className="w-8 h-8 flex items-center justify-center text-slate-500 border border-slate-300 rounded bg-white">...</span>
            
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50">16</button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseTable;
