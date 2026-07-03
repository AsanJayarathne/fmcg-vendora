import React, { useState } from 'react';

const OrderRequestTable = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const tabs = ['All Orders', 'pending Orders', 'Delivered', 'Returned'];

  const data = [
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Kasun', distributor: 'Star Grocery Store', amount: '15,000.00', payment: 'cash', status: 'Delivered' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Nimal', distributor: 'Asan Grocery Store', amount: '31,340.00', payment: 'credit', status: 'Delivered' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Nimal', distributor: 'New Grocery Store', amount: '10,000.00', payment: 'Partial', status: 'Delivered' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Nimal', distributor: 'Green Super', amount: '15,000.00', payment: '---', status: 'Returned' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Nimal', distributor: 'Starlight Store', amount: '15,000.00', payment: 'cash', status: 'Delivered' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Kasun', distributor: 'Nimal Store', amount: '15,000.00', payment: 'cash', status: 'Pending' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Kasun', distributor: 'Star Grocery Store', amount: '25,500.00', payment: '---', status: 'Returned' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Kasun', distributor: 'Happy Mart', amount: '15,000.00', payment: 'cash', status: 'Delivered' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Kasun', distributor: 'Star Grocery Store', amount: '15,000.00', payment: 'cash', status: 'Delivered' },
    { distId: 'DEL-001', orderId: 'ORD-001', driver: 'Kasun', distributor: 'Lakmini Store', amount: '5,000.00', payment: 'credit', status: 'Delivered' },
  ];

  const filteredData = activeTab === 'All Orders' 
    ? data 
    : data.filter(item => item.status.toLowerCase() === activeTab.replace(' Orders', '').toLowerCase());

  const getPaymentColor = (payment) => {
    switch (payment.toLowerCase()) {
      case 'cash': return 'text-green-500';
      case 'credit': return 'text-red-500';
      case 'partial': return 'text-purple-600';
      default: return 'text-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-500';
      case 'returned': return 'text-red-500';
      case 'pending': return 'text-orange-500';
      default: return 'text-slate-800';
    }
  };

  return (
    <div className="w-full pb-8">
      {/* Tabs */}
      <div className="flex bg-white border border-slate-200 rounded-lg px-2 mb-6 shadow-sm overflow-hidden">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-blue-500 text-blue-500' 
                : 'border-transparent text-slate-800 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.2fr_1fr_1fr_1fr] px-6 py-4 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-sm shadow-sm">
          <div>Distributor ID</div>
          <div>Order ID</div>
          <div>Driver</div>
          <div>Distributor</div>
          <div>Total Amount(LKR)</div>
          <div>Payment</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>
        
        {/* Rows */}
        {filteredData.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.2fr_1fr_1fr_1fr] px-6 py-4 bg-white border border-slate-200 rounded-lg items-center text-sm shadow-sm hover:shadow transition-shadow text-slate-700 font-medium">
            <div>{item.distId}</div>
            <div>{item.orderId}</div>
            <div>{item.driver}</div>
            <div>{item.distributor}</div>
            <div>{item.amount}</div>
            <div className={`font-semibold ${getPaymentColor(item.payment)}`}>{item.payment}</div>
            <div className={`font-semibold ${getStatusColor(item.status)}`}>{item.status}</div>
            <div className="flex justify-center">
              <button className="px-6 py-1.5 border border-blue-200 text-blue-400 rounded-md font-bold text-xs hover:bg-blue-50 transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="text-xs font-semibold text-slate-500">
          showing 1 to 8 of 1508 Orders
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

export default OrderRequestTable;
