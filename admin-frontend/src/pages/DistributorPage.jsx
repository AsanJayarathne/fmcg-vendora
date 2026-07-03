import React from 'react';
import DistributorTable from '../components/Tables/DistributorTable';
import DistributorStatCards from '../components/DistributorStatCards';

const DistributorPage = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Distributor Management</h1>
      </div>
      
      <DistributorStatCards />

      <DistributorTable />
    </div>
  );
};

export default DistributorPage;
