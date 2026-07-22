import { useState, useEffect, useMemo } from "react";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import Pagination from "../components/Pagination";
import DistributorBatchDrillDownModal from "../components/inventory/DistributorBatchDrillDownModal";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";
import { Loader2, AlertTriangle, X } from "lucide-react";

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

  const handleResetFilters = () => {
    setSearch(""); setSelectedCategory(""); setSelectedStatus(""); setCurrentPage(1);
  };

  const paginatedStock = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStock.slice(start, start + itemsPerPage);
  }, [filteredStock, currentPage]);

  return (
    <div className="space-y-4 font-sans">
      <PageHeader title="Manage My Stock" subtitle="View and manage your current stock" />

      {/* Low Stock Alert Banner */}
      {!alertDismissed && lowStockProducts.length > 0 && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-amber-800">
            <span className="font-bold">{lowStockProducts.length} product{lowStockProducts.length !== 1 ? "s" : ""} low on stock:</span>
            {" "}
            <span className="font-medium">
              {lowStockProducts.slice(0, 5).map(p => p.product_name).join(", ")}
              {lowStockProducts.length > 5 && ` + ${lowStockProducts.length - 5} more`}
            </span>
            {" "}— Consider requesting stock soon.
          </div>
          <button onClick={() => setAlertDismissed(true)}
            className="text-amber-500 hover:text-amber-700 transition cursor-pointer flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

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
        <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-lg">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
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