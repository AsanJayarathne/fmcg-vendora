import { useState } from 'react';
import JobCard from '../components/JobCard';

function JobPool() {
  const [jobs, setJobs] = useState([
    { id: 1, orderId: 'ORD-1234', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '12 kg', items: '10 Items', distance: '12 km', status: 'Available' },
    { id: 2, orderId: 'ORD-1235', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '8 kg', items: '6 Items', distance: '8 km', status: 'Available' },
    { id: 3, orderId: 'ORD-1236', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '15 kg', items: '12 Items', distance: '20 km', status: 'Available' },
    { id: 4, orderId: 'ORD-1237', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '5 kg', items: '4 Items', distance: '5 km', status: 'Available' },
    { id: 5, orderId: 'ORD-1238', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '10 kg', items: '8 Items', distance: '15 km', status: 'Available' },
    { id: 6, orderId: 'ORD-1239', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '7 kg', items: '5 Items', distance: '10 km', status: 'Available' },
    { id: 7, orderId: 'ORD-1240', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '20 kg', items: '15 Items', distance: '25 km', status: 'Available' },
    { id: 8, orderId: 'ORD-1241', store: 'Jayarathne Stores', address: 'No.297, Galle Road, Colombo 03', weight: '3 kg', items: '2 Items', distance: '3 km', status: 'Available' },
  ]);

  const claimJob = (id) => {
    setJobs(jobs.map((job) =>
      job.id === id ? { ...job, status: 'Claimed' } : job
    ));
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Job Pool</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClaim={() => claimJob(job.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default JobPool;