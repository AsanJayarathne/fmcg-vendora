import React from 'react';
import MonthlyChart from '../components/graps/MonthlyChart';
import YearlyStockChart from '../components/graps/YearlyStockChart';
import ExpensesDonutChart from '../components/graps/ExpensesDonutChart';
import SalesTerritoryChart from '../components/graps/SalesTerritoryChart';
import LowStockAlertsTable from '../components/graps/LowStockAlertsTable';

const Dashboard = () => {
  return (
    <div className="w-full">
      {/* Date Picker */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-semibold text-slate-800">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          May 20, 2026
        </div>
      </div>

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
  );
};

export default Dashboard;
