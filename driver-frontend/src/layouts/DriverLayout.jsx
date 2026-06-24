import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import TopBar from '../components/TopBar';

function DriverLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <TopBar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DriverLayout;