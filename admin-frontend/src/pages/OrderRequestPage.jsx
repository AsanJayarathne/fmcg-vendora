import React from 'react';
import OrderRequestTable from '../components/Tables/OrderRequestTable';

const OrderRequestPage = () => {
  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Supply Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Review and approve stock requests from distributors</p>
      </div>
      <OrderRequestTable />
    </div>
  );
};

export default OrderRequestPage;
