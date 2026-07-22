import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Pagination from '../Pagination';
import ApproveRequestModal from '../supply/ApproveRequestModal';
import RejectRequestModal from '../supply/RejectRequestModal';
import { Loader2 } from 'lucide-react';

const API = 'http://localhost/fmcg-vendora/backend/api/admin/supply-requests.php';

const TABS = ['All', 'Pending', 'Partially_Approved', 'Rejected', 'Received'];

const statusStyle = {
  Pending:             { badge: 'text-amber-700 bg-amber-50 border-amber-200',   dot: 'bg-amber-500'   },
  Partially_Approved:  { badge: 'text-blue-700  bg-blue-50  border-blue-200',    dot: 'bg-blue-500'    },
  Rejected:            { badge: 'text-rose-700  bg-rose-50  border-rose-200',    dot: 'bg-rose-500'    },
  Received:            { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const OrderRequestTable = () => {
  const { auth } = useAuth();
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeTab, setActiveTab]   = useState('All');
  const [search, setSearch]         = useState('');
  const [currentPage, setPage]      = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [viewRequest, setViewRequest]       = useState(null);  // full request for modals
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [approveTarget, setApproveTarget]   = useState(null);
  const [rejectTarget, setRejectTarget]     = useState(null);

  const fetchRequests = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${auth?.token}` } });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load supply requests');
      setRequests(json.data || []);
    } catch (err) {
      setError(err.message || 'Network error');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (auth?.token) fetchRequests(); }, [auth?.token]);

  // Load full request details (with items)
  const loadDetails = async (requestId, mode) => {
    setLoadingDetails(true);
    try {
      const res  = await fetch(`${API}?id=${requestId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load details');
      if (mode === 'approve') setApproveTarget(json.data);
      if (mode === 'reject')  setRejectTarget(json.data);
    } catch (err) {
      alert(err.message);
    } finally { setLoadingDetails(false); }
  };

  // Filters
  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchTab    = activeTab === 'All' || r.status === activeTab;
      const code        = `REQ-${String(r.request_id).padStart(3, '0')}`;
      const matchSearch = !search ||
        code.toLowerCase().includes(search.toLowerCase()) ||
        r.distributor_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.region_name?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [requests, activeTab, search]);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Count per tab
  const counts = useMemo(() => {
    const c = { All: requests.length };
    TABS.slice(1).forEach(t => { c[t] = requests.filter(r => r.status === t).length; });
    return c;
  }, [requests]);

  const handleApproved = (updatedRequest) => {
    setRequests(prev => prev.map(r => r.request_id === updatedRequest.request_id ? { ...r, status: updatedRequest.status } : r));
    setApproveTarget(null);
  };

  const handleRejected = (requestId) => {
    setRequests(prev => prev.map(r => r.request_id === requestId ? { ...r, status: 'Rejected' } : r));
    setRejectTarget(null);
  };

  return (
    <div className="w-full font-sans">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
              ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab === 'Partially_Approved' ? 'Approved' : tab}
            {counts[tab] > 0 && (
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black
                ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 w-72">
        <input
          type="text" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by REQ ID or distributor..."
          className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder-slate-400"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50/60 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-4">Request ID</th>
                <th className="px-5 py-4">Distributor</th>
                <th className="px-5 py-4">Region</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-center">Items</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center text-slate-400 font-medium">
                    No supply requests found.
                  </td>
                </tr>
              ) : (
                paginated.map(r => {
                  const code  = `REQ-${String(r.request_id).padStart(3, '0')}`;
                  const style = statusStyle[r.status] || statusStyle.Pending;
                  const isPending  = r.status === 'Pending';
                  const isApproved = r.status === 'Partially_Approved';
                  return (
                    <tr key={r.request_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{code}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{r.distributor_name}</td>
                      <td className="px-5 py-3.5 text-slate-500">{r.region_name || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {r.request_date ? new Date(r.request_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                          {r.item_count ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {r.status === 'Partially_Approved' ? 'Approved' : r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => loadDetails(r.request_id, 'approve')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => loadDetails(r.request_id, 'reject')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {!isPending && (
                            <span className="text-xs text-slate-400 font-medium">
                              {r.status === 'Rejected' ? 'Rejected' : r.status === 'Received' ? 'Received ✓' : 'Transferred'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          label="requests"
        />
      </div>

      {/* Loading overlay for detail fetch */}
      {loadingDetails && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <Loader2 className="animate-spin text-white" size={36} />
        </div>
      )}

      {/* Modals */}
      {approveTarget && (
        <ApproveRequestModal
          request={approveTarget}
          onClose={() => setApproveTarget(null)}
          onApproved={handleApproved}
        />
      )}
      {rejectTarget && (
        <RejectRequestModal
          request={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onRejected={handleRejected}
        />
      )}
    </div>
  );
};

export default OrderRequestTable;
