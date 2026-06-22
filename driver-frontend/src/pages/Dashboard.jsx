import { Briefcase, CheckCircle, Wallet, Undo2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import JobCard from '../components/JobCard';

function Dashboard() {
  const history = [
    { id: 'ORD-1234', route: 'Colombo — Nugegoda', status: 'Delivered', date: '17/06/26' },
    { id: 'ORD-1235', route: 'Kandy — Peradeniya', status: 'Delivered', date: '17/06/26' },
    { id: 'ORD-1236', route: 'Galle — Matara', status: 'Returned', date: '17/06/26' },
    { id: 'ORD-1237', route: 'Negombo — Ja-Ela', status: 'Pending', date: '17/06/26' },
  ];

  const jobsClaimed = history.length;
  const completed = history.filter((h) => h.status === 'Delivered').length;
  const returned = history.filter((h) => h.status === 'Returned').length;
  const cashCollected = completed * 31250;

  const stats = [
    { label: 'Jobs Claimed', value: jobsClaimed, icon: Briefcase, color: 'text-orange-500' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Cash Collected', value: `Rs. ${cashCollected.toLocaleString()}`, icon: Wallet, color: 'text-amber-600' },
    { label: 'Returned', value: returned, icon: Undo2, color: 'text-red-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Here's your summary for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Delivery History */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Delivery history</h3>
            <span className="text-xs text-orange-500 cursor-pointer">View all</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Order No.</th>
                <th className="pb-2 font-medium">Route</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-800 font-medium">{item.id}</td>
                  <td className="py-2.5 text-gray-500">{item.route}</td>
                  <td className="py-2.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-2.5 text-gray-400 text-right">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Open Jobs */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Open jobs nearby</h3>
            <span className="text-xs text-orange-500 cursor-pointer">See all</span>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { route: 'Colombo — Nugegoda', items: 5, amount: 'Rs. 32,000', status: 'Available' },
              { route: 'Kandy — Peradeniya', items: 3, amount: 'Rs. 18,500', status: 'Available' },
              { route: 'Galle — Matara', items: 7, amount: 'Rs. 47,000', status: 'Available' },
            ].map((job) => (
              <JobCard
                key={job.route}
                route={job.route}
                items={job.items}
                amount={job.amount}
                status={job.status}
                onClaim={() => alert('Go to Job Pool page to claim routes')}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;