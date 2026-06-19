import { useState } from 'react';
import { Truck, CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

function MyRoute() {
  const [routes, setRoutes] = useState([
    { id: 1, orderId: 'ORD-1234', route: 'Colombo — Nugegoda', items: 5, amount: 'Rs. 32,000', status: 'Pending' },
    { id: 2, orderId: 'ORD-1235', route: 'Kandy — Peradeniya', items: 3, amount: 'Rs. 18,500', status: 'Pending' },
    { id: 3, orderId: 'ORD-1236', route: 'Galle — Matara', items: 7, amount: 'Rs. 47,000', status: 'Pending' },
  ]);

  const updateStatus = (id, newStatus) => {
    setRoutes(routes.map((route) =>
      route.id === id ? { ...route, status: newStatus } : route
    ));
  };

  
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800">My route</h2>
        <p className="text-sm text-gray-500 mt-1">Your claimed deliveries today</p>
      </div>

      {/* Route Cards */}
      <div className="flex flex-col gap-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Truck size={18} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{route.orderId}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{route.route}</div>
                </div>
              </div>
              <StatusBadge status={route.status} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="text-xs text-gray-400">
                {route.items} items · {route.amount}
              </div>

              {route.status === 'Pending' && (
                <div className="flex items-center gap-2">
                 <button
                    onClick={() => updateStatus(route.id, 'Delivered')}
                    className="text-xs px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle size={13} /> Delivered
                  </button>
                  <button
                    onClick={() => updateStatus(route.id, 'Returned')}
                    className="text-xs px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-1.5"
                  >
                    <XCircle size={13} /> Returned
                  </button>
                </div>
              )}

              {route.status === 'Delivered' && (
                <div className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                  <CheckCircle size={13} /> Delivery completed
                </div>
              )}

              {route.status === 'Returned' && (
                <div className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                  <XCircle size={13} /> Order returned
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRoute;