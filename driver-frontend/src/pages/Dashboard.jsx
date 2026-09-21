import { useState, useEffect, useMemo } from 'react';
import { Truck, CheckCircle, Wallet, HandCoins, Calendar, Layers, RefreshCw, AlertCircle, Search, Download, FileText, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import InvoiceModal from '../components/InvoiceModal';

function Dashboard() {
  const { auth } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedInvoiceDelivery, setSelectedInvoiceDelivery] = useState(null);

  const fetchDashboardData = async () => {
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
        throw new Error(json.message || "Failed to load dashboard deliveries");
      }
      setDeliveries(json.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Error connecting to dispatch server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [auth]);

  // Derived Statistics
  const totalClaimedJobs = deliveries.length;
  const completedJobs = deliveries.filter(d => d.status === 'DELIVERED').length;
  const pendingJobs = deliveries.filter(d => d.status === 'CLAIMED').length;

  // Pending Cash to Collect
  const cashToCollect = deliveries
    .filter(d => d.status === 'CLAIMED')
    .reduce((sum, d) => {
      const cashAmt = parseFloat(d.cash_amount) || 0;
      const outstanding = parseFloat(d.outstanding_credit) || 0;
      const totalCol = (cashAmt + outstanding) > 0 ? (cashAmt + outstanding) : (d.payment_method === 'Cash' ? (parseFloat(d.order_amount) || 0) : 0);
      return sum + totalCol;
    }, 0);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Daily Collection Amount (ONLY deliveries completed TODAY)
  const todayDelivered = deliveries.filter(d => {
    if (d.status !== 'DELIVERED') return false;
    const delivDate = d.delivery_date || d.updated_at || d.created_at;
    if (!delivDate) return false;
    const datePart = delivDate.split(' ')[0].split('T')[0];
    return datePart === todayStr;
  });

  const dailyCashCollected = todayDelivered.reduce((sum, d) => {
    const collected = parseFloat(d.collected_amount);
    if (!isNaN(collected) && collected > 0) {
      return sum + collected;
    }
    const cashAmt = parseFloat(d.cash_amount) || 0;
    const outstanding = parseFloat(d.outstanding_credit) || 0;
    const totalCol = (cashAmt + outstanding) > 0 ? (cashAmt + outstanding) : (d.payment_method === 'Cash' ? (parseFloat(d.order_amount) || 0) : 0);
    return sum + totalCol;
  }, 0);

  const stats = [
    {
      label: 'Jobs Claimed',
      value: totalClaimedJobs,
      icon: Truck,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
      subtitle: `${pendingJobs} in progress`
    },
    {
      label: 'Jobs Completed',
      value: completedJobs,
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      subtitle: `${totalClaimedJobs > 0 ? Math.round((completedJobs / totalClaimedJobs) * 100) : 0}% completion rate`
    },
    {
      label: 'Cash to Collect',
      value: `Rs. ${cashToCollect.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      subtitle: 'From active route stops'
    },
    {
      label: 'Daily Collection Amount',
      value: `Rs. ${dailyCashCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: HandCoins,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      subtitle: `${todayDelivered.length} completed today`
    },
  ];

  // Filtered deliveries list
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(item => {
      if (filterStatus === 'DELIVERED' && item.status !== 'DELIVERED') return false;
      if (filterStatus === 'CLAIMED' && item.status !== 'CLAIMED') return false;
      if (filterStatus === 'RETURNED' && item.status !== 'RETURNED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = `ORD-${item.order_id || item.delivery_id}`.toLowerCase().includes(q) || String(item.delivery_id).includes(q);
        const shopMatch = (item.shop_name || '').toLowerCase().includes(q);
        const addressMatch = (item.shop_address || '').toLowerCase().includes(q) || (item.city || '').toLowerCase().includes(q);
        const paymentMatch = (item.payment_method || '').toLowerCase().includes(q);
        if (!idMatch && !shopMatch && !addressMatch && !paymentMatch) return false;
      }
      return true;
    });
  }, [deliveries, filterStatus, searchQuery]);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shift Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Real-time driver dispatch summary & delivery history</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-600">
            <Calendar size={14} className="text-orange-500" />
            <span>{currentDate}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            title="Refresh Dashboard"
            className="p-2 bg-white rounded-xl border border-slate-200/80 text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 transition cursor-pointer shadow-xs"
            aria-label="Refresh Dashboard"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-orange-500' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200/70 text-rose-700 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/myroute"
          className="group p-4 sm:p-5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-100">Live Navigation</span>
            <h3 className="text-lg font-extrabold tracking-tight">Manage Active Route Orders</h3>
            <p className="text-xs text-orange-100/90">{pendingJobs} pending order stops in your current shift</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
            <ArrowRight size={18} />
          </div>
        </Link>

        <Link
          to="/jobpool"
          className="group p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Open Dispatch</span>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Claim Orders from Pool</h3>
            <p className="text-xs text-slate-500">Pick up new retail deliveries ready in your area</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
            <ArrowRight size={18} />
          </div>
        </Link>
      </div>

      {/* Delivery History Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Delivery Activity</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">All assigned and completed deliveries for your account</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60 text-xs">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'CLAIMED', label: 'Pending' },
                { id: 'DELIVERED', label: 'Delivered' },
                { id: 'RETURNED', label: 'Returned' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium text-xs">
            <RefreshCw size={24} className="animate-spin text-orange-500 mx-auto mb-2" />
            Loading assigned delivery history...
          </div>
        ) : filteredDeliveries.length === 0 ? (
          /* Empty State */
          <div className="p-10 text-center text-slate-500">
            <Package size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Delivery Activity Found</h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm mx-auto">
              {searchQuery || filterStatus !== 'ALL'
                ? 'No deliveries matched your filter criteria.'
                : 'You have not claimed any deliveries yet. Check the Open Job Pool to get started!'}
            </p>
          </div>
        ) : (
          /* History Table with responsive horizontal scroll */
          <div className="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3.5 rounded-l-xl">Order Info</th>
                  <th className="py-3 px-3.5">Store / Route</th>
                  <th className="py-3 px-3.5">Payment</th>
                  <th className="py-3 px-3.5">Order Amount</th>
                  <th className="py-3 px-3.5">Collected Cash</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 rounded-r-xl text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDeliveries.map((item) => {
                  const orderId = item.order_id || item.delivery_id;
                  const displayStatus = item.status === 'CLAIMED' ? 'Pending' : (item.status === 'DELIVERED' ? 'Delivered' : (item.status === 'RETURNED' ? 'Returned' : item.status));
                  const amount = parseFloat(item.order_amount || item.total_amount || 0);
                  const collected = parseFloat(item.collected_amount || 0);
                  const cashPortion = parseFloat(item.cash_amount || 0);
                  const outCredit = parseFloat(item.outstanding_credit || 0);
                  const totalCol = (cashPortion + outCredit) > 0 ? (cashPortion + outCredit) : (item.payment_method === 'Cash' ? amount : 0);
                  const dateStr = item.delivery_date || item.claimed_at || item.created_at;
                  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A';

                  return (
                    <tr key={item.delivery_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-slate-800">#ORD-{orderId}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.total_items ? `${item.total_items} items` : 'Standard'} • {formattedDate}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <div className="font-semibold text-slate-800 truncate max-w-[160px]">{item.shop_name || 'Retail Store'}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {item.city ? `${item.city}` : (item.shop_address || 'Dispatch Hub')}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 font-medium whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-[11px]">
                          {item.payment_method || 'Cash'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 font-bold text-slate-800 whitespace-nowrap">
                        Rs. {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-3.5 font-bold whitespace-nowrap">
                        {item.status === 'DELIVERED' ? (
                          <span className="text-emerald-700 font-extrabold">
                            Rs. {(collected > 0 ? collected : totalCol).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        ) : item.status === 'CLAIMED' ? (
                          <span className="text-amber-600 text-[11px] font-semibold">
                            Pending (Rs. {totalCol.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <StatusBadge status={displayStatus} />
                      </td>
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInvoiceDelivery(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600 transition-all cursor-pointer"
                        >
                          <FileText size={13} />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceDelivery && (
        <InvoiceModal
          delivery={selectedInvoiceDelivery}
          onClose={() => setSelectedInvoiceDelivery(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;