import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import DistributorStatCards from "../components/DistributorStatCards";
import DistributorTable from "../components/Tables/DistributorTable";
import { Building2, RotateCcw } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

const DistributorPage = () => {
  const { auth } = useAuth();
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [updating, setUpdating]         = useState(null);

  const fetchDistributors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/distributors.php`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setDistributors(json.data || []);
    } catch (err) {
      setError(err.message || "Failed to load distributors.");
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setDistributors((prev) =>
        prev.map((d) =>
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
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <Building2 className="inline mr-3 text-blue-600 w-8 h-8" />
          Distributor Management
          {!loading && (
            <span className="ml-3 text-base font-normal text-slate-500">
              ({distributors.length} companies)
            </span>
          )}
        </h1>

        <button
          onClick={fetchDistributors}
          disabled={loading}
          className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh List
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Metric Cards */}
      <DistributorStatCards distributors={distributors} loading={loading} />

      {/* Distributor Table */}
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
