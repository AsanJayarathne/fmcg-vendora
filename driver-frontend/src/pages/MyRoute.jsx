import { useState, useEffect, useMemo } from 'react';
import RouteCard from '../components/RouteCard';
import { useAuth } from '../auth/AuthContext';
import { RefreshCw, PackageCheck, AlertCircle, Search, DollarSign, Truck, Filter } from 'lucide-react';

function MyRoute() {
  const { auth } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [activeTab, setActiveTab] = useState('Picked Up'); // 'Picked Up', 'Delivered', 'Returned'
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL'); // 'ALL', 'Cash', 'Credit', 'Cash_Credit'

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
        else if (item.payment_method === 'Online') paymentLabel = 'Online (Prepaid)';

        return {
          id: item.delivery_id,
          store: item.shop_name,
          address: item.city ? `${item.shop_address}, ${item.city}` : item.shop_address,
          items: `${item.total_items} Items`,
          paymentType: paymentLabel,
          rawPaymentMethod: item.payment_method,
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

  // Filtered routes calculation
  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      // Tab filter
      if (activeTab === 'Picked Up' && route.status !== 'Pending') return false;
      if (activeTab === 'Delivered' && route.status !== 'Delivered') return false;
      if (activeTab === 'Returned' && route.status !== 'Returned') return false;

      // Payment Filter
      if (paymentFilter !== 'ALL' && route.rawPaymentMethod !== paymentFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesStore = route.store?.toLowerCase().includes(query);
        const matchesAddress = route.address?.toLowerCase().includes(query);
        const matchesId = route.id?.toString().includes(query);
        if (!matchesStore && !matchesAddress && !matchesId) return false;
      }

      return true;
    });
  }, [routes, activeTab, paymentFilter, searchQuery]);

  // Total cash to collect for currently pending orders
  const pendingCollectibleTotal = useMemo(() => {
    return routes
      .filter(r => r.status === 'Pending')
      .reduce((sum, r) => sum + r.totalCollectible, 0);
  }, [routes]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Route Orders</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage assigned deliveries, track split payments, and confirm completions</p>
        </div>
        <button
          onClick={fetchRoutes}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : 'text-slate-500'} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* ── Financial Summary Banner ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Deliveries</span>
            <div className="text-xl font-extrabold text-slate-800">
              {routes.filter(r => r.status === 'Pending').length} Orders
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cash to Collect</span>
            <div className="text-xl font-extrabold text-emerald-700">
              Rs. {pendingCollectibleTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <PackageCheck size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed Shift Jobs</span>
            <div className="text-xl font-extrabold text-slate-800">
              {routes.filter(r => r.status === 'Delivered').length} Delivered
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Controls Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Status Tabs */}
          <div className="bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 flex gap-1 max-w-md w-full">
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

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by store name, address, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Payment Method Quick Filter Pills */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter size={12} /> Payment:
          </span>
          {[
            { id: 'ALL', label: 'All Payments' },
            { id: 'Cash', label: 'Cash Only' },
            { id: 'Credit', label: 'Full Credit' },
            { id: 'Cash_Credit', label: 'Cash + Credit' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPaymentFilter(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                paymentFilter === p.id
                  ? 'bg-orange-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200/70 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Orders List ── */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-medium text-xs">
          Loading assigned route orders...
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm">
          <PackageCheck size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Matching Orders</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || paymentFilter !== 'ALL' ? (
              <>No orders match your search or filter criteria. Try clearing search filters.</>
            ) : activeTab === 'Picked Up' ? (
              <>No picked up deliveries in your route. Head over to "Open Job Pool" to claim orders!</>
            ) : activeTab === 'Delivered' ? (
              <>No delivered orders recorded for this shift.</>
            ) : (
              <>No returned orders recorded for this shift.</>
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              id={route.id}
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
              isUpdating={updatingId === route.id}
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