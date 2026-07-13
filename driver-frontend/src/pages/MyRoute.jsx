import { useState, useEffect } from 'react';
import RouteCard from '../components/RouteCard';
import { useAuth } from '../auth/AuthContext';

function MyRoute() {
  const { auth } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState('Picked Up'); // 'Picked Up', 'Delivered', 'Returned'

  const fetchRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/driver/deliveries.php", {
        headers: {
          "Authorization": `Bearer ${auth?.token}`
        }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load route deliveries");
      }
      
      const mappedRoutes = json.data.map(item => {
        const orderAmount = parseFloat(item.order_amount) || 0;
        const cashAmt     = parseFloat(item.cash_amount) || 0;
        const creditAmt   = parseFloat(item.credit_amount) || 0;
        const outstanding = parseFloat(item.outstanding_credit) || 0;

        // Total the driver needs to collect = cash portion of this order + any outstanding credit
        const totalCollectible = cashAmt + outstanding;

        // Determine payment label
        let paymentLabel = 'Cash Payment';
        if (item.payment_method === 'Credit') paymentLabel = 'Full Credit';
        else if (item.payment_method === 'Cash_Credit') paymentLabel = 'Cash + Credit';

        return {
          id: item.delivery_id,
          store: item.shop_name,
          address: item.city ? `${item.shop_address}, ${item.city}` : item.shop_address,
          items: `${item.total_items} Items`,
          paymentType: paymentLabel,
          amount: `Rs. ${orderAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          status: item.status === 'CLAIMED' ? 'Pending' : (item.status === 'DELIVERED' ? 'Delivered' : 'Returned'),
          numericAmount: orderAmount,
          cashAmount: cashAmt,
          creditAmount: creditAmt,
          outstandingCredit: outstanding,
          totalCollectible: totalCollectible,
          isCash: item.payment_method === 'Cash',
          latitude: item.latitude ? parseFloat(item.latitude) : null,
          longitude: item.longitude ? parseFloat(item.longitude) : null
        };
      });
      setRoutes(mappedRoutes);
    } catch (err) {
      setError(err.message || "Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchRoutes();
    } else {
      setLoading(false);
    }
  }, [auth]);

  const handleAction = async (id, action, routeItem) => {
    setUpdatingId(id);
    try {
      // When marking as delivered, collect the total collectible amount
      // (order cash portion + outstanding credit settlement)
      const body = action === 'deliver' 
        ? { collected_amount: routeItem.totalCollectible ?? routeItem.numericAmount, remarks: "Delivered successfully" }
        : { remarks: "Returned by customer" };

      const res = await fetch(`http://localhost/fmcg-vendora/backend/api/driver/deliveries.php?id=${id}&action=${action}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth?.token}`
        },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Failed to mark delivery as ${action}ed`);
      }
      
      // Update UI state
      setRoutes(routes.map(r => 
        r.id === id ? { ...r, status: action === 'deliver' ? 'Delivered' : 'Returned' } : r
      ));
    } catch (err) {
      alert(err.message || "Error updating delivery status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRoutes = routes.filter(route => {
    if (activeTab === 'Picked Up') return route.status === 'Pending';
    if (activeTab === 'Delivered') return route.status === 'Delivered';
    if (activeTab === 'Returned') return route.status === 'Returned';
    return true;
  });

  return (
    <div className="bg-white min-h-screen p-6 font-sans">

      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-orange-500">My Orders</h2>
        <button
          onClick={fetchRoutes}
          className="text-xs px-4 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 transition-all font-medium cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-orange-50/50 p-1.5 rounded-2xl border border-orange-100/50 max-w-md">
        {['Picked Up', 'Delivered', 'Returned'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading your route...</div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-2xl border border-gray-100">
          {activeTab === 'Picked Up' ? (
            <>No picked up deliveries in your route. Go to "Open Job Pool" to take orders!</>
          ) : activeTab === 'Delivered' ? (
            <>No delivered orders found in your route.</>
          ) : (
            <>No returned orders found in your route.</>
          )}
        </div>
      ) : (
        /* Route Cards */
        <div className="flex flex-col gap-3">
          {filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              store={route.store}
              items={route.items}
              paymentType={route.paymentType}
              address={route.address}
              amount={route.amount}
              status={route.status}
              cashAmount={route.cashAmount}
              creditAmount={route.creditAmount}
              outstandingCredit={route.outstandingCredit}
              totalCollectible={route.totalCollectible}
              onDeliver={() => handleAction(route.id, 'deliver', route)}
              onReturn={() => handleAction(route.id, 'return', route)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default MyRoute;