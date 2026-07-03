import React from 'react';

const DistributorTable = () => {
  const data = [
    { initials: 'KP', initialsBg: 'bg-green-100 text-green-600', name: 'Kasun Perera', id: 'DR-1001', phone: '071-2564231', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
    { initials: 'NS', initialsBg: 'bg-blue-100 text-blue-600', name: 'Nuwan Silva', id: 'DR-1002', phone: '071-2578831', addressId: 'SG-BB-2326', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '25 April 2026' },
    { initials: 'AR', initialsBg: 'bg-purple-100 text-purple-600', name: 'Asan Rasmika', id: 'DR-1003', phone: '071-2145235', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
    { initials: 'DS', initialsBg: 'bg-red-100 text-red-600', name: 'Dileepa Saranga', id: 'DR-1004', phone: '071-2004231', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
    { initials: 'KP', initialsBg: 'bg-green-100 text-green-600', name: 'Kasun Perera', id: 'DR-1001', phone: '071-2564231', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
    { initials: 'KP', initialsBg: 'bg-green-100 text-green-600', name: 'Kasun Perera', id: 'DR-1001', phone: '071-2564231', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
    { initials: 'DS', initialsBg: 'bg-red-100 text-red-600', name: 'Dileepa Saranga', id: 'DR-1004', phone: '071-2004231', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
    { initials: 'DS', initialsBg: 'bg-red-100 text-red-600', name: 'Dileepa Saranga', id: 'DR-1004', phone: '071-2004231', addressId: 'WP-AB-2356', addressType: 'Truck', regId: 'WP472356', regType: 'Heavy Vehicle', date: '18 May 2026' },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {/* Header Row */}
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] px-6 py-4 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-sm">
          <div>Distributor</div>
          <div>Contact</div>
          <div>Address</div>
          <div>Business Reg.</div>
          <div>Registered On</div>
          <div className="text-center">Action</div>
        </div>
        
        {/* Rows */}
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] px-6 py-3 bg-white border border-slate-200 rounded-lg items-center hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.initialsBg}`}>
                {item.initials}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">{item.id}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              {item.phone}
            </div>
            
            <div className="flex flex-col text-sm">
              <span className="font-medium text-slate-800">{item.addressId}</span>
              <span className="text-xs text-slate-400 mt-0.5">{item.addressType}</span>
            </div>
            
            <div className="flex flex-col text-sm">
              <span className="font-medium text-slate-800">{item.regId}</span>
              <span className="text-xs text-slate-400 mt-0.5">{item.regType}</span>
            </div>
            
            <div className="text-sm font-medium text-slate-700">
              {item.date}
            </div>
            
            <div className="flex justify-center">
              <button className="px-4 py-1.5 border border-blue-200 text-blue-500 rounded font-bold text-xs hover:bg-blue-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white border border-slate-200 rounded-lg">
        <div className="text-xs font-semibold text-slate-500">
          showing 1 to 2 of 2 Pages
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
  );
};

export default DistributorTable;
