import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import OrderRequestTable from "../components/Tables/OrderRequestTable";
import MetricCard from "../components/MetricCard";
import { Truck, Clock, CheckCircle2, XCircle } from "lucide-react";

const API = "http://localhost/fmcg-vendora/backend/api/admin/supply-requests.php";

const OrderRequestPage = () => {
  const { auth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchSummaryData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${auth?.token}` } });
      const json = await res.json();
      if (json.success) setRequests(json.data || []);
    } catch { /* silent */ }
    finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth?.token) fetchSummaryData();
  }, [auth?.token, fetchSummaryData]);

  const metrics = useMemo(() => {
    const total    = requests.length;
    const pending  = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Partially_Approved" || r.status === "Received").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, [requests]);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Truck className="inline mr-3 text-blue-600 w-8 h-8" />
        Supply Requests
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({metrics.total} requests)
          </span>
        )}
      </h1>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Supply Requests"
          value={loading ? "..." : metrics.total.toLocaleString()}
          subtitle="Distributor Orders"
          icon={<Truck size={20} />}
          color="blue"
        />
        <MetricCard
          title="Pending Approval"
          value={loading ? "..." : metrics.pending.toLocaleString()}
          subtitle="Awaiting Transfer"
          icon={<Clock size={20} />}
          color="amber"
        />
        <MetricCard
          title="Approved / Fulfilled"
          value={loading ? "..." : metrics.approved.toLocaleString()}
          subtitle="Stock Transferred"
          icon={<CheckCircle2 size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Rejected Requests"
          value={loading ? "..." : metrics.rejected.toLocaleString()}
          subtitle="Unfulfilled Stock"
          icon={<XCircle size={20} />}
          color="red"
        />
      </div>

      {/* Supply Requests Table */}
      <OrderRequestTable />
    </div>
  );
};

export default OrderRequestPage;
