import { useState, useEffect, useMemo } from "react";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import DistributorBatchDrillDownModal from "../components/inventory/DistributorBatchDrillDownModal";
import { useAuth } from "../auth/AuthContext";
import { Package, AlertTriangle, X, CheckCircle2, AlertCircle, Layers, Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function MyInventoryPage() {
  const { auth } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Filters State
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus]     = useState("");
  const [currentPage, setCurrentPage]           = useState(1);
  const itemsPerPage = 8;

  // Selected item + real batch details
  const [selectedProduct, setSelectedProduct]   = useState(null);
  const [batchDetails, setBatchDetails]         = useState([]);
  const [loadingBatches, setLoadingBatches]     = useState(false);

  // Low stock alert banner
  const [alertDismissed, setAlertDismissed] = useState(false);

  const fetchStock = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API_BASE}/distributor/stock.php`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStockItems(data.data || []);
      } else {
        setError(data.message || "Failed to load inventory stock.");
      }
    } catch {
      setError("Failed to communicate with the server.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchStock();
      localStorage.removeItem('inventory_needs_refresh');
    }
  }, [auth?.token]);

  // Fetch real distributor_batch rows for a selected product
  const fetchBatchDetails = async (product) => {
    setLoadingBatches(true);
    setBatchDetails([]);
    try {
      const res  = await fetch(`${API_BASE}/distributor/stock.php?product_id=${product.product_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) setBatchDetails(json.data || []);
    } catch { /* silent */ }
    finally { setLoadingBatches(false); }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    fetchBatchDetails(product);
  };

  // Aggregate stockItems by product_id
  const aggregatedStock = useMemo(() => {
    const map = {};
    stockItems.forEach(b => {
      if (!map[b.product_id]) {
        map[b.product_id] = {
          product_id:    b.product_id,
          product_name:  b.product_name,
          category_name: b.category_name,
          unit:          b.unit,
          quantity:      0,
          batches:       [],
        };
      }
      if (b.status === 'Active') {
        map[b.product_id].quantity += parseInt(b.quantity || 0);
      }
      map[b.product_id].batches.push(b);
    });
    return Object.values(map);
  }, [stockItems]);

  // Categories
  const categories = useMemo(() => {
    const list = aggregatedStock.map(i => i.category_name).filter(Boolean);
    return [...new Set(list)].sort();
  }, [aggregatedStock]);

  const getStatus = qty => qty <= 0 ? "Out of Stock" : qty <= 20 ? "Low" : "Good";

  // Low stock products (qty ≤ 20)
  const lowStockProducts = useMemo(
    () => aggregatedStock.filter(i => parseInt(i.quantity || 0) <= 20 && parseInt(i.quantity || 0) > 0),
    [aggregatedStock]
  );

  // Filter
  const filteredStock = useMemo(() => {
    return aggregatedStock.filter(item => {
      const code = `PRD-${String(item.product_id).padStart(3, "0")}`;
      const matchSearch = item.product_name.toLowerCase().includes(search.toLowerCase()) ||
                          code.toLowerCase().includes(search.toLowerCase());
      const matchCat    = selectedCategory ? item.category_name === selectedCategory : true;
      const status      = getStatus(parseInt(item.quantity || 0));
      const matchStatus = selectedStatus
        ? selectedStatus === "Low" ? status === "Low"
          : selectedStatus === "Out of Stock" ? status === "Out of Stock"
          : status === "Good"
        : true;
      return matchSearch && matchCat && matchStatus;
    });
  }, [aggregatedStock, search, selectedCategory, selectedStatus]);

  // Metrics
  const metrics = useMemo(() => {
    const totalItems = aggregatedStock.length;
    const totalQty   = aggregatedStock.reduce((acc, item) => acc + parseInt(item.quantity || 0), 0);
    const lowCount   = aggregatedStock.filter(item => parseInt(item.quantity || 0) <= 20 && parseInt(item.quantity || 0) > 0).length;
    const outCount   = aggregatedStock.filter(item => parseInt(item.quantity || 0) <= 0).length;
    return { totalItems, totalQty, lowCount, outCount };
  }, [aggregatedStock]);

  const handleResetFilters = () => {
    setSearch(""); setSelectedCategory(""); setSelectedStatus(""); setCurrentPage(1);
  };

  const paginatedStock = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStock.slice(start, start + itemsPerPage);
  }, [filteredStock, currentPage]);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Package className="inline mr-3 text-blue-600 w-8 h-8" />
        Inventory Stock
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({filteredStock.length} items)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={metrics.totalItems}
          subtitle="Inventory Catalog"
          icon={<Package size={20} />}
          color="blue"
        />
        <MetricCard
          title="Active Stock Units"
          value={metrics.totalQty.toLocaleString()}
          subtitle="Available Units"
          icon={<Layers size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Low Stock Alert"
          value={metrics.lowCount}
          subtitle="Needs Reorder"
          icon={<AlertTriangle size={20} />}
          color="amber"
        />
        <MetricCard
          title="Out of Stock"
          value={metrics.outCount}
          subtitle="Zero Stock"
          icon={<AlertCircle size={20} />}
          color="red"
        />
      </div>

      {/* Low Stock Alert Banner */}
      {!alertDismissed && lowStockProducts.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 font-semibold">
              <span className="font-bold">{lowStockProducts.length} product{lowStockProducts.length !== 1 ? "s" : ""} low on stock:</span>{" "}
              {lowStockProducts.slice(0, 5).map(p => p.product_name).join(", ")}
              {lowStockProducts.length > 5 && ` + ${lowStockProducts.length - 5} more`}
            </p>
          </div>
          <button
            onClick={() => setAlertDismissed(true)}
            className="p-1 rounded-full text-amber-500 hover:text-amber-700 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Controls */}
      <InventoryFilters
        search={search}
        onSearchChange={val => { setSearch(val); setCurrentPage(1); }}
        selectedCategory={selectedCategory}
        onCategoryChange={val => { setSelectedCategory(val); setCurrentPage(1); }}
        selectedStatus={selectedStatus}
        onStatusChange={val => { setSelectedStatus(val); setCurrentPage(1); }}
        categories={categories}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-xs">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <InventoryTable
            items={paginatedStock}
            onSelectProduct={handleSelectProduct}
            selectedProductId={selectedProduct?.product_id}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredStock.length}
            itemsPerPage={itemsPerPage}
            label="Products"
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Real Batch Details Modal */}
      {selectedProduct && (
        <DistributorBatchDrillDownModal
          product={selectedProduct}
          batches={loadingBatches ? [] : batchDetails}
          loading={loadingBatches}
          onClose={() => {
            setSelectedProduct(null);
            setBatchDetails([]);
          }}
        />
      )}
    </div>
  );
}