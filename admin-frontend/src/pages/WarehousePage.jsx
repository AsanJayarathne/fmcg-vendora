import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import WarehouseTable from "../components/Tables/WarehouseTable";
import WarehouseStatCards from "../components/warehouse/WarehouseStatCards";
import AddBatchModal from "../components/warehouse/AddBatchModal";
import { Boxes } from "lucide-react";

const API = "http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php";

const WarehousePage = () => {
  const { auth } = useAuth();
  const [summary, setSummary]                 = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [showAddBatch, setShowAddBatch]       = useState(false);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res  = await fetch(`${API}?summary=1`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) setSummary(json.data);
    } catch { /* silent */ }
    finally { setSummaryLoading(false); }
  };

  useEffect(() => {
    if (auth?.token) fetchSummary();
  }, [auth?.token, tableRefreshKey]);

  const handleBatchAdded = () => {
    setShowAddBatch(false);
    setTableRefreshKey((k) => k + 1);
  };

  const totalSKUs = summary?.total_skus ? Number(summary.total_skus) : null;

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Boxes className="inline mr-3 text-blue-600 w-8 h-8" />
        Warehouse Management
        {!summaryLoading && totalSKUs !== null && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({totalSKUs} SKUs)
          </span>
        )}
      </h1>

      {/* Stat Cards */}
      <WarehouseStatCards summary={summary} loading={summaryLoading} />

      {/* Stock Table */}
      <WarehouseTable
        onAddBatchClick={() => setShowAddBatch(true)}
        refreshKey={tableRefreshKey}
      />

      {/* Add Batch Modal */}
      {showAddBatch && (
        <AddBatchModal
          onClose={() => setShowAddBatch(false)}
          onBatchAdded={handleBatchAdded}
        />
      )}
    </div>
  );
};

export default WarehousePage;
