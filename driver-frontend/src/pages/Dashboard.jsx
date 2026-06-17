function Dashboard() {
  const stats = [
    { label: 'Jobs Claimed', value: '4', icon: '💼', color: 'text-purple-600' },
    { label: 'Completed', value: '4', icon: '✅', color: 'text-green-600' },
    { label: 'Cash Collected', value: 'Rs. 125,000', icon: '💵', color: 'text-amber-600' },
    { label: 'Returned', value: '0', icon: '↩️', color: 'text-red-500' },
  ];

  const history = [
    { id: 'ORD-1234', route: 'Colombo — Nugegoda', status: 'Delivered', date: '17/06/26' },
    { id: 'ORD-1235', route: 'Kandy — Peradeniya', status: 'Delivered', date: '17/06/26' },
    { id: 'ORD-1236', route: 'Galle — Matara', status: 'Returned', date: '17/06/26' },
    { id: 'ORD-1237', route: 'Negombo — Ja-Ela', status: 'Pending', date: '17/06/26' },
  ];

  const statusStyle = {
    Delivered: 'bg-green-100 text-green-700',
    Returned: 'bg-red-100 text-red-600',
    Pending: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div>
      {/* Top greeting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-800">Hello, Kamal — have a nice day</h2>
          <p className="text-sm text-gray-500 mt-1">Delivery Driver · D001 · Tuesday, 17 June 2026</p>
        </div>
        <div className="bg-purple-100 text-purple-700 text-sm px-4 py-1.5 rounded-full">
          On Duty
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`text-sm text-gray-500 flex items-center gap-2 mb-2`}>
              <span>{stat.icon}</span> {stat.label}
            </div>
            <div className={`text-2xl font-medium ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Delivery History */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Delivery history</h3>
            <span className="text-xs text-purple-600 cursor-pointer">View all</span>
          </div>
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-800">{item.id}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.route}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusStyle[item.status]}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Jobs */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Open jobs nearby</h3>
            <span className="text-xs text-purple-600 cursor-pointer">See all</span>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { route: 'Colombo — Nugegoda', items: 5, amount: 'Rs. 32,000' },
              { route: 'Kandy — Peradeniya', items: 3, amount: 'Rs. 18,500' },
              { route: 'Galle — Matara', items: 7, amount: 'Rs. 47,000' },
            ].map((job) => (
              <div key={job.route} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-800">{job.route}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{job.items} items · {job.amount}</div>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100">
                  Claim
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;