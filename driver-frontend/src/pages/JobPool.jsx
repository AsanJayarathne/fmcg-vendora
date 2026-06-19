import { useState } from 'react';
import JobCard from '../components/JobCard';


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
            <JobCard
              key={job.id}
              route={job.route}
              items={job.items}
              amount={job.amount}
              distance={job.distance}
              status={job.status}
              onClaim={() => claimJob(job.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobPool;