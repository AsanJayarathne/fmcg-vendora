import { Truck, CheckCircle, Wallet, ShoppingCart, Undo2, Download } from 'lucide-react';
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
  const cashProcessed = history.filter((h) => h.status === 'Delivered').reduce((sum, h) => sum + parseFloat(h.amount.replace('Rs. ', '').replace(',', '')), 0);

  const stats = [
    { label: 'Jobs Claimed', value: jobsClaimed, icon: Truck, percentage: '18.72%', percentageUp: true },
    { label: 'Jobs Completed', value: jobsCompleted, icon: CheckCircle, percentage: '33.02%', percentageUp: false },
    { label: 'Cash Claimed', value: `Rs. ${cashClaimed.toLocaleString()}.00`, icon: Wallet, percentage: '33.02%', percentageUp: true },
    { label: 'Cash Processed', value: `Rs. ${cashProcessed.toLocaleString()}.00`, icon: ShoppingCart, percentage: '33.02%', percentageUp: false },
    { label: 'Returned', value: returned, icon: Undo2, percentage: '18.72%', percentageUp: true },
  ];

  const avatarColors = [
    'bg-pink-200',
    'bg-yellow-200',
    'bg-blue-200',
  ];

  return (
    <div className="bg-white min-h-screen p-6">

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Today Summary</h2>
      </div>

      {/* Stats — 4 in first row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stats.slice(0, 4).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Stats — 1 in second row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard {...stats[4]} />
      </div>

      {/* Delivery History */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery History</h3>
        <div className="flex flex-col gap-3">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-100"
            >
              {/* Avatar + Order Info */}
              <div className="flex items-center gap-4 w-48">
                <div className={`w-10 h-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center`}>
                  <Truck size={18} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{item.id}</div>
                  <div className="text-xs text-orange-500 mt-0.5">
                    Weight: <span className="font-medium">{item.weight}</span> &nbsp;
                    Items: <span className="font-medium">{item.items}</span>
                  </div>
                </div>
              </div>

             {/* Payment Type */}
              <div className="w-36">
                <div className="text-xs font-semibold text-gray-900 mb-0.5">Payment Type</div>
                <div className="text-xs text-gray-400">{item.paymentType}</div>
              </div>

              {/* Status */}
              <div className="w-28">
                <div className="text-xs font-semibold text-gray-900 mb-0.5">Status</div>
                <div className="text-xs text-gray-400">{item.status}</div>
              </div>

              {/* Amount */}
              <div className="w-28">
                <div className="text-xs font-semibold text-gray-900 mb-0.5">Amount</div>
                <div className="text-xs text-gray-400">{item.amount}</div>
              </div>

              {/* Download Button */}
              <button className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all">
                <Download size={13} />
                Download Invoice
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;