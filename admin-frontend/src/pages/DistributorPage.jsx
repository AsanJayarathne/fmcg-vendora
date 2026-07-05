import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import DistributorStatCards from '../components/DistributorStatCards';
import DistributorTable from '../components/Tables/DistributorTable';

const API_BASE = 'http://localhost/fmcg-vendora/backend/api';

const DistributorPage = () => {
  const { auth } = useAuth();
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null); // distributor_id being updated

  const fetchDistributors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/distributors.php`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setDistributors(json.data);
    } catch (err) {
      setError(err.message || 'Failed to load distributors.');
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const handleStatusUpdate = async (distributorId, newStatus) => {
    setUpdating(distributorId);
    try {
      const res = await fetch(`${API_BASE}/admin/distributors.php?id=${distributorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      // Optimistically update local state
      setDistributors(prev =>
        prev.map(d =>
          d.distributor_id === distributorId ? { ...d, status: newStatus } : d
        )
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Distributor Management</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage distributor applications and accounts.</p>
        </div>
        <button
          onClick={fetchDistributors}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <DistributorStatCards distributors={distributors} loading={loading} />

      <DistributorTable
        distributors={distributors}
        loading={loading}
        updating={updating}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default DistributorPage;
