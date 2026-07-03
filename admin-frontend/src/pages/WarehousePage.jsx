import React from 'react';
import WarehouseTable from '../components/Tables/WarehouseTable';

const WarehousePage = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Warehouse Management</h1>
      </div>
      <WarehouseTable />
    </div>
  );
};

export default WarehousePage;
