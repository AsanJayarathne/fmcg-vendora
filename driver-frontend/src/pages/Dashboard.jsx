import { Truck, CheckCircle, Wallet, Undo2, Download, Calendar, Layers } from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

function Dashboard() {
  const history = [
    { id: 'ORD-1234', route: 'Colombo - Nugegoda', status: 'Delivered', date: '17/06/26', paymentType: 'Cash on delivery', amount: 'Rs. 5,756.00', weight: '21kg', items: 22 },
    { id: 'ORD-1235', route: 'Kandy - Peradeniya', status: 'Delivered', date: '17/06/26', paymentType: 'Credit', amount: 'Rs. 5,450.00', weight: '10kg', items: 20 },
    { id: 'ORD-1236', route: 'Galle - Matara', status: 'Returned', date: '17/06/26', paymentType: 'Cash on delivery', amount: 'Rs. 3,200.00', weight: '8kg', items: 12 },
  ];

  const jobsClaimed = history.length;
  const jobsCompleted = history.filter((h) => h.status === 'Delivered').length;
  const returned = history.filter((h) => h.status === 'Returned').length;
  const cashClaimed = history.reduce((sum, h) => sum + parseFloat(h.amount.replace('Rs. ', '').replace(',', '')), 0);

  const stats = [
    { label: 'Jobs Claimed', value: jobsClaimed, icon: Truck, percentage: '18.72%', percentageUp: true },
    { label: 'Jobs Completed', value: jobsCompleted, icon: CheckCircle, percentage: '33.02%', percentageUp: true },
    { label: 'Cash Claimed', value: `Rs. ${cashClaimed.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Wallet, percentage: '33.02%', percentageUp: true },
    { label: 'Returned Orders', value: returned, icon: Undo2, percentage: '4.15%', percentageUp: false },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shift Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Real-time driver dispatch summary & delivery history</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-600 self-start sm:self-auto">
          <Calendar size={14} className="text-orange-500" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Delivery History Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Delivery Activity</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Completed and returned deliveries during this shift</p>
            </div>
          </div>
        </div>

        {/* History Table with responsive horizontal scroll */}
        <div className="overflow-x-auto no-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 rounded-l-xl">Order Info</th>
                <th className="py-3 px-3.5">Route</th>
                <th className="py-3 px-3.5">Payment</th>
                <th className="py-3 px-3.5">Amount</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 rounded-r-xl text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-slate-800">{item.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.weight} • {item.items} items
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 font-medium text-slate-700 whitespace-nowrap">{item.route}</td>
                  <td className="py-3.5 px-3.5 text-slate-600 font-medium whitespace-nowrap">{item.paymentType}</td>
                  <td className="py-3.5 px-3.5 font-bold text-orange-600 whitespace-nowrap">{item.amount}</td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600 transition-all cursor-pointer">
                      <Download size={13} />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;