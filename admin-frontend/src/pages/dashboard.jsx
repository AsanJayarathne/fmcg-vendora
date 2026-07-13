import React from 'react';
import MonthlyChart from '../components/graps/MonthlyChart';
import YearlyStockChart from '../components/graps/YearlyStockChart';
import ExpensesDonutChart from '../components/graps/ExpensesDonutChart';
import SalesTerritoryChart from '../components/graps/SalesTerritoryChart';
import LowStockAlertsTable from '../components/graps/LowStockAlertsTable';

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      </div>
      <div className="w-full">
        
       

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <MonthlyChart />
          <YearlyStockChart />
          <ExpensesDonutChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesTerritoryChart />
          <LowStockAlertsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
