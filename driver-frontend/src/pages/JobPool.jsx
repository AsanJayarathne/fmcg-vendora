import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { useAuth } from '../auth/AuthContext';

function JobPool() {
  const { auth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/driver/deliveries.php?type=open", {
        headers: {
          "Authorization": `Bearer ${auth?.token}`
        }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load job pool");
      }
      
      const mappedJobs = json.data.map(item => ({
        id: item.delivery_id,
        orderId: `ORD-${item.order_id}`,
        store: item.shop_name,
        address: item.city ? `${item.shop_address}, ${item.city}` : item.shop_address,
        items: `${item.total_items} Items`,
        amount: `Rs. ${parseFloat(item.order_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        paymentMethod: `${item.payment_method} Payment`,
        status: item.status === 'OPEN' ? 'Available' : 'Claimed'
      }));
      setJobs(mappedJobs);
    } catch (err) {
      setError(err.message || "Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [auth]);

  const claimJob = async (id) => {
    setClaimingId(id);
    try {
      const res = await fetch(`http://localhost/fmcg-vendora/backend/api/driver/deliveries.php?id=${id}&action=claim`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${auth?.token}`
        }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to claim job");
      }
      setJobs(jobs.map((job) =>
        job.id === id ? { ...job, status: 'Claimed' } : job
      ));
    } catch (err) {
      alert(err.message || "Error claiming the job");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-gray-900">Job Pool</h2>
        <button
          onClick={fetchJobs}
          className="text-xs px-4 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 transition-all font-medium cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium font-sans">Loading open jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-2xl border border-gray-100 font-sans">
          No available jobs in the pool right now.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              claiming={claimingId === job.id}
              onClaim={() => claimJob(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default JobPool;