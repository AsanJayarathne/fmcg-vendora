import { MessageCircle, Bell } from 'lucide-react';

function TopBar() {
  return (
    <div className="h-16 bg-white border-b border-orange-100 flex items-center justify-between px-6 flex-shrink-0">
      <div></div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-gray-900 text-white text-xs px-4 py-2 rounded-full hover:bg-gray-700">
          <MessageCircle size={14} />
          Messages
        </button>
        <button className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200">
          <Bell size={16} className="text-orange-500" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-white text-xs font-medium">
          KP
        </div>
      </div>
    </div>
  );
}

export default TopBar;