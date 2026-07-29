import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";
import Pagination from "../Pagination";
import ApproveRequestModal from "../supply/ApproveRequestModal";
import RejectRequestModal from "../supply/RejectRequestModal";
import { Search, Loader2, CheckCircle, XCircle } from "lucide-react";

const API = "http://localhost/fmcg-vendora/backend/api/admin/supply-requests.php";
const TABS = ["All", "Pending", "Partially_Approved", "Rejected", "Received"];

const StatusBadge = ({ status }) => {
  const isApproved = status === "Partially_Approved" || status === "Received";
  const isPending  = status === "Pending";
  const isRejected = status === "Rejected";

  const displayLabel = status === "Partially_Approved" ? "Approved" : status;

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isApproved
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
          : isPending
          ? "bg-amber-50 text-amber-700 border border-amber-200/50"
          : isRejected
          ? "bg-rose-50 text-rose-700 border border-rose-200/50"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      {displayLabel}
    </span>
  );
};

export default function OrderRequestTable() {
  const { auth } = useAuth();
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [activeTab, setActiveTab]   = useState("All");
  const [search, setSearch]         = useState("");
  const [currentPage, setPage]      = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [approveTarget, setApproveTarget]   = useState(null);
  const [rejectTarget, setRejectTarget]     = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${auth?.token}` } });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load supply requests");
      setRequests(json.data || []);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchRequests();
  }, [auth?.token]);

  const loadDetails = async (requestId, mode) => {
    setLoadingDetails(true);
    try {
      const res  = await fetch(`${API}?id=${requestId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load details");
      if (mode === "approve") setApproveTarget(json.data);
      if (mode === "reject")  setRejectTarget(json.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchTab = activeTab === "All" || r.status === activeTab;
      const code     = `REQ-${String(r.request_id).padStart(3, "0")}`;
      const matchSearch =
        !search ||
        code.toLowerCase().includes(search.toLowerCase()) ||
        r.distributor_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.region_name?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [requests, activeTab, search]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated  = filtered.slice(startIndex, startIndex + itemsPerPage);

  const counts = useMemo(() => {
    const c = { All: requests.length };
    TABS.slice(1).forEach((t) => {
      c[t] = requests.filter((r) => r.status === t).length;
    });
    return c;
  }, [requests]);

  const handleApproved = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.request_id === updatedRequest.request_id ? { ...r, status: updatedRequest.status } : r))
    );
    setApproveTarget(null);
  };

  const handleRejected = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.request_id === requestId ? { ...r, status: "Rejected" } : r))
    );
    setRejectTarget(null);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Pill Navigation & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
          {TABS.map((tab) => {
            const label = tab === "Partially_Approved" ? "Approved" : tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 ${
                  activeTab === tab
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                    : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
                }`}
              >
                {label}
                {counts[tab] > 0 && (
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                      activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {counts[tab]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search REQ ID or distributor..."
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Distributor</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                    <p className="text-4xl mb-2">🚚</p>
                    <p className="font-bold text-slate-800 text-sm">No supply requests found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search criteria or filter status.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const code      = `REQ-${String(r.request_id).padStart(3, "0")}`;
                  const isPending = r.status === "Pending";
                  return (
                    <tr key={r.request_id} className="hover:bg-slate-50/60 transition duration-150">
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {code}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                        {r.distributor_name}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-600 text-xs">
                        {r.region_name || "—"}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-500 text-xs">
                        {r.request_date
                          ? new Date(r.request_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs">
                          {r.item_count ?? "—"} items
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => loadDetails(r.request_id, "approve")}
                                className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <CheckCircle size={13} />
                                Approve
                              </button>

                              <button
                                onClick={() => loadDetails(r.request_id, "reject")}
                                className="px-4 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <XCircle size={13} />
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold italic">
                              {r.status === "Rejected" ? "Rejected" : r.status === "Received" ? "Received ✓" : "Transferred"}
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

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            label="requests"
          />
        )}
      </div>

      {/* Loading overlay for details */}
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
}
