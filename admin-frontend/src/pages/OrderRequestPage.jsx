import React from 'react';
import OrderRequestTable from '../components/Tables/OrderRequestTable';

const OrderRequestPage = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Order Requests</h1>
      </div>
      
      <OrderRequestTable />
    </div>
  );
};

export default OrderRequestPage;
