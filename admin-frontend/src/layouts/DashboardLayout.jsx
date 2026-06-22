import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px] min-h-screen relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 pt-[110px] pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
