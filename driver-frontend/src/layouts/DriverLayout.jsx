import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import TopBar from '../components/TopBar';

function DriverLayout() {
  return (
    <div className="flex h-screen bg-slate-50/60 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar />
        <main className="flex-1 p-6 md:p-8 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DriverLayout;