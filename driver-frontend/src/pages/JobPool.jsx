import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { useAuth } from '../auth/AuthContext';
import { RefreshCw, Briefcase, AlertCircle } from 'lucide-react';

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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Open Job Pool</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Claim unassigned retail orders in your delivery zone</p>
        </div>
        <button
          onClick={fetchJobs}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : 'text-slate-500'} />
          <span>Refresh Pool</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200/70 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-medium text-xs">
          Searching available orders in the dispatch pool...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm">
          <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">Job Pool Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            There are currently no open orders available for claiming. Check back shortly for new dispatches!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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