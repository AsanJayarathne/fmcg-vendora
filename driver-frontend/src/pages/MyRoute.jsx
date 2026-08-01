import { useState, useEffect } from 'react';
import RouteCard from '../components/RouteCard';
import { useAuth } from '../auth/AuthContext';
import { RefreshCw, PackageCheck, AlertCircle } from 'lucide-react';

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

        const totalCollectible = cashAmt + outstanding;

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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Orders & Deliveries</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage active route orders and mark delivery completions</p>
        </div>
        <button
          onClick={fetchRoutes}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : 'text-slate-500'} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Modern Segmented Tabs */}
      <div className="bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 flex gap-1 max-w-md">
        {['Picked Up', 'Delivered', 'Returned'].map((tab) => {
          const isActive = activeTab === tab;
          const count = routes.filter(r => {
            if (tab === 'Picked Up') return r.status === 'Pending';
            if (tab === 'Delivered') return r.status === 'Delivered';
            if (tab === 'Returned') return r.status === 'Returned';
            return false;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span className={`px-1.5 py-0.5 text-[10px] rounded-md ${
                isActive ? 'bg-orange-50 text-orange-600 font-extrabold' : 'bg-slate-200/60 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200/70 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-medium text-xs">
          Loading assigned delivery routes...
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm">
          <PackageCheck size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'Picked Up' ? (
              <>No picked up deliveries in your route. Head over to "Open Job Pool" to claim orders!</>
            ) : activeTab === 'Delivered' ? (
              <>No delivered orders recorded for this filter.</>
            ) : (
              <>No returned orders recorded for this filter.</>
            )}
          </p>
        </div>
      ) : (
        /* Route Cards List */
        <div className="flex flex-col gap-4">
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