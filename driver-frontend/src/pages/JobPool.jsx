import { useState } from 'react';

function JobPool() {
  const [jobs, setJobs] = useState([
    { id: 1, route: 'Colombo — Nugegoda', items: 5, amount: 'Rs. 32,000', distance: '12 km', status: 'Available' },
    { id: 2, route: 'Kandy — Peradeniya', items: 3, amount: 'Rs. 18,500', distance: '8 km', status: 'Available' },
    { id: 3, route: 'Galle — Matara', items: 7, amount: 'Rs. 47,000', distance: '20 km', status: 'Available' },
    { id: 4, route: 'Negombo — Ja-Ela', items: 4, amount: 'Rs. 25,000', distance: '15 km', status: 'Available' },
    { id: 5, route: 'Kurunegala — Polgahawela', items: 6, amount: 'Rs. 38,000', distance: '18 km', status: 'Available' },
  ]);

  const claimJob = (id) => {
    setJobs(jobs.map((job) =>
      job.id === id ? { ...job, status: 'Claimed' } : job
    ));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800">Open job pool</h2>
        <p className="text-sm text-gray-500 mt-1">Claim available delivery routes</p>
      </div>

      {/* Job Cards */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                  🚚
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{job.route}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {job.items} items · {job.amount} · {job.distance}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {job.status === 'Available' ? (
                  <button
                    onClick={() => claimJob(job.id)}
                    className="text-xs px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all"
                  >
                    Claim route
                  </button>
                ) : (
                  <span className="text-xs px-4 py-2 rounded-full bg-green-100 text-green-700">
                    ✅ Claimed
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobPool;