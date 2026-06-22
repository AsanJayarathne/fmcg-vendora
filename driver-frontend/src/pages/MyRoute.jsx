import { useState } from 'react';
import RouteCard from '../components/RouteCard';

function MyRoute() {
  const [routes, setRoutes] = useState([
    { id: 1, store: 'Jayarathne Stores', distance: '12 km', weight: '21kg', items: '22', paymentType: 'Cash on delivery', address: 'No 297, Galle Road, Colombo 03', amount: 'Rs. 5,756.00', status: 'Pending' },
    { id: 2, store: 'Jayarathne Stores', distance: '12 km', weight: '21kg', items: '22', paymentType: 'Cash on delivery', address: 'No 297, Galle Road, Colombo 03', amount: 'Rs. 5,756.00', status: 'Pending' },
    { id: 3, store: 'Jayarathne Stores', distance: '12 km', weight: '21kg', items: '22', paymentType: 'Cash on delivery', address: 'No 297, Galle Road, Colombo 03', amount: 'Rs. 5,756.00', status: 'Pending' },
    { id: 4, store: 'Jayarathne Stores', distance: '12 km', weight: '21kg', items: '22', paymentType: 'Cash on delivery', address: 'No 297, Galle Road, Colombo 03', amount: 'Rs. 5,756.00', status: 'Pending' },
    { id: 5, store: 'Jayarathne Stores', distance: '12 km', weight: '21kg', items: '22', paymentType: 'Cash on delivery', address: 'No 297, Galle Road, Colombo 03', amount: 'Rs. 5,756.00', status: 'Pending' },
    { id: 6, store: 'Jayarathne Stores', distance: '12 km', weight: '21kg', items: '22', paymentType: 'Cash on delivery', address: 'No 297, Galle Road, Colombo 03', amount: 'Rs. 5,756.00', status: 'Pending' },
  ]);

  const updateStatus = (id, newStatus) => {
    setRoutes(routes.map((route) =>
      route.id === id ? { ...route, status: newStatus } : route
    ));
  };

  return (
    <div className="bg-white min-h-screen p-6">

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-orange-500">My Route</h2>
      </div>

      {/* Route Cards */}
      <div className="flex flex-col gap-3">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            store={route.store}
            distance={route.distance}
            weight={route.weight}
            items={route.items}
            paymentType={route.paymentType}
            address={route.address}
            amount={route.amount}
            status={route.status}
            onDeliver={() => updateStatus(route.id, 'Delivered')}
            onReturn={() => updateStatus(route.id, 'Returned')}
          />
        ))}
      </div>

    </div>
  );
}

export default MyRoute;