import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import WarehouseTable from '../components/Tables/WarehouseTable';
import WarehouseStatCards from '../components/warehouse/WarehouseStatCards';
import AddBatchModal from '../components/warehouse/AddBatchModal';

const API = 'http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php';

const WarehousePage = () => {
  const { auth } = useAuth();
  const [summary, setSummary]         = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [showAddBatch, setShowAddBatch] = useState(false);
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
    setTableRefreshKey(k => k + 1);
  };

  return (
    <div className="w-full font-sans">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Warehouse Management</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor stock levels, batches, and incoming goods</p>
        </div>
      </div>

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
