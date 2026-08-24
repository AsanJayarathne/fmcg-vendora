import { useState, useEffect, useMemo } from "react";

import RequestStockTabs from "../components/inventory/RequestStockTabs";
import RequestStockFilters from "../components/inventory/RequestStockFilters";
import RequestStockTable from "../components/inventory/RequestStockTable";
import RequestedStockTable from "../components/inventory/RequestedStockTable";
import ReceivedStockTable from "../components/inventory/ReceivedStockTable";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import CurrentRequestCard from "../components/inventory/CurrentRequestCard";
import RequestDetailsModal from "../components/inventory/RequestDetailsModal";
import ReceiveStockModal from "../components/inventory/ReceiveStockModal";
import { useAuth } from "../auth/AuthContext";
import { PackagePlus, Clock, CheckCircle2, PackageCheck, Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function RequestStockPage() {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("Request Stock");
  
  // Data State
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Current request draft (cart) state
  const [currentRequest, setCurrentRequest] = useState({ items: [] });
  const [remarks, setRemarks]               = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [successMsg, setSuccessMsg]         = useState("");

  // Detailed view request state
  const [viewRequest, setViewRequest]       = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [receiveTarget, setReceiveTarget]   = useState(null);

  // Filters State
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus]     = useState("");

  // Pagination State
  const [requestPage, setRequestPage]     = useState(1);
  const [requestedPage, setRequestedPage] = useState(1);
  const [receivedPage, setReceivedPage]   = useState(1);
  const itemsPerPage = 8;

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${auth?.token}` };
      const [prodRes, reqRes] = await Promise.all([
        fetch(`${API_BASE}/distributor/products.php`, { headers }),
        fetch(`${API_BASE}/distributor/supply-requests.php`, { headers }),
      ]);

      const prodJson = await prodRes.json();
      const reqJson  = await reqRes.json();

      if (prodJson.success && reqJson.success) {
        setProducts(prodJson.data.products || []);
        setRequests(reqJson.data || []);
      } else {
        setError("Failed to retrieve products or requests data.");
      }
    } catch (err) {
      setError("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchData();
    }
  }, [auth?.token]);

  // Reset filters when changing tabs
  useEffect(() => {
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
  }, [activeTab]);

  // Categories extracted dynamically from products
  const categories = useMemo(() => {
    const list = products.map((p) => p.category_name).filter(Boolean);
    return [...new Set(list)].sort();
  }, [products]);

  // Metrics
  const metrics = useMemo(() => {
    const totalCatalog = products.length;
    const activeReqs   = requests.filter(r => r.status !== 'Delivered' && r.status !== 'Received').length;
    const pendingReqs  = requests.filter(r => r.status === 'Pending').length;
    const receivedReqs = requests.filter(r => r.status === 'Partially_Approved' || r.status === 'Received').length;
    return { totalCatalog, activeReqs, pendingReqs, receivedReqs };
  }, [products, requests]);

  // Fetch single request details (items)
  const handleViewRequestDetails = async (request) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`${API_BASE}/distributor/supply-requests.php?id=${request.request_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) {
        setViewRequest(json.data);
      } else {
        alert(json.message || "Failed to load request details.");
      }
    } catch (err) {
      alert("Error reaching the server.");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Add item to draft request
  const handleRequestItem = (product, quantity) => {
    setCurrentRequest((prev) => {
      const existing = prev.items.find((item) => item.product_id === product.product_id);
      let updatedItems;

      if (existing) {
        updatedItems = prev.items.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [
          ...prev.items,
          {
            product_id: product.product_id,
            product_name: product.product_name,
            base_price: product.base_price,
            quantity: quantity,
          },
        ];
      }
      return { ...prev, items: updatedItems };
    });

    setSuccessMsg(`Added ${quantity} units of ${product.product_name} to your request draft.`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Handle receiving confirmed
  const handleReceiveConfirmed = (updatedRequest) => {
    setRequests(prev => prev.map(r =>
      r.request_id === updatedRequest.request_id ? { ...r, status: 'Received' } : r
    ));
    setReceiveTarget(null);
  };

  // Remove item from draft request
  const handleRemoveItem = (productId) => {
    setCurrentRequest((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.product_id !== productId),
    }));
  };

  // Clear entire draft request
  const handleClearRequest = () => {
    if (window.confirm("Are you sure you want to clear your current request draft?")) {
      setCurrentRequest({ items: [] });
      setRemarks("");
    }
  };

  // Submit supply request to admin
  const handleSubmitRequest = async () => {
    if (currentRequest.items.length === 0) return;
    setSubmitting(true);
    try {
      const mappedItems = currentRequest.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_BASE}/distributor/supply-requests.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          items: mappedItems,
          remarks: remarks,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Supply request submitted successfully!");
        setCurrentRequest({ items: [] });
        setRemarks("");
        
        const [prodRes, reqRes] = await Promise.all([
          fetch(`${API_BASE}/distributor/products.php`, {
            headers: { Authorization: `Bearer ${auth?.token}` },
          }),
          fetch(`${API_BASE}/distributor/supply-requests.php`, {
            headers: { Authorization: `Bearer ${auth?.token}` },
          }),
        ]);
        const prodJson = await prodRes.json();
        const reqJson = await reqRes.json();
        if (prodJson.success) setProducts(prodJson.data?.products || []);
        if (reqJson.success) setRequests(reqJson.data || []);

        setActiveTab("Requested Stock");
      } else {
        alert(json.message || "Failed to submit request.");
      }
    } catch (err) {
      alert("Network error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Logics
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const code = `PRD-${String(item.product_id).padStart(3, "0")}`;
      const matchesSearch =
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory
        ? item.category_name === selectedCategory
        : true;

      const matchesStatus = selectedStatus
        ? (selectedStatus === "Low Stock"
            ? item.warehouse_stock > 0 && item.warehouse_stock <= 50
            : selectedStatus === "Out of Stock"
            ? item.warehouse_stock <= 0
            : item.warehouse_stock > 50)
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const paginatedProducts = useMemo(() => {
    const start = (requestPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, requestPage]);

  const filteredRequests = useMemo(() => {
    const activeReqs = requests.filter(
      (r) => r.status !== "Delivered" && r.status !== "Received"
    );
    return activeReqs.filter((item) => {
      const code = `REQ-${String(item.request_id).padStart(3, "0")}`;
      const matchesSearch =
        code.toLowerCase().includes(search.toLowerCase()) ||
        (item.remarks && item.remarks.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = selectedStatus ? item.status === selectedStatus : true;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, selectedStatus]);

  const paginatedRequests = useMemo(() => {
    const start = (requestedPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, requestedPage]);

  const filteredReceived = useMemo(() => {
    const historyReqs = requests.filter(
      (r) => r.status === "Partially_Approved" || r.status === "Received"
    );
    return historyReqs.filter((item) => {
      const code = `REQ-${String(item.request_id).padStart(3, "0")}`;
      return (
        code.toLowerCase().includes(search.toLowerCase()) ||
        (item.remarks && item.remarks.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [requests, search]);

  const paginatedReceived = useMemo(() => {
    const start = (receivedPage - 1) * itemsPerPage;
    return filteredReceived.slice(start, start + itemsPerPage);
  }, [filteredReceived, receivedPage]);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <PackagePlus className="inline mr-3 text-blue-600 w-8 h-8" />
        Request Stock
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({filteredProducts.length} products)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Manufacturer Catalog"
          value={metrics.totalCatalog}
          subtitle="Available Products"
          icon={<PackagePlus size={20} />}
          color="blue"
        />
        <MetricCard
          title="Active Requests"
          value={metrics.activeReqs}
          subtitle="In Progress"
          icon={<Clock size={20} />}
          color="purple"
        />
        <MetricCard
          title="Pending Approval"
          value={metrics.pendingReqs}
          subtitle="Awaiting Admin"
          icon={<Clock size={20} />}
          color="amber"
        />
        <MetricCard
          title="Transferred Stock"
          value={metrics.receivedReqs}
          subtitle="Ready / Received"
          icon={<CheckCircle2 size={20} />}
          color="emerald"
        />
      </div>

      {/* Navigation Pills */}
      <RequestStockTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {successMsg && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-bold rounded-2xl shadow-2xs animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-xs">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {activeTab === "Request Stock" && (
            <>
              <RequestStockFilters
                search={search}
                onSearchChange={(val) => {
                  setSearch(val);
                  setRequestPage(1);
                }}
                selectedCategory={selectedCategory}
                onCategoryChange={(val) => {
                  setSelectedCategory(val);
                  setRequestPage(1);
                }}
                categories={categories}
                selectedStatus={selectedStatus}
                onStatusChange={(val) => {
                  setSelectedStatus(val);
                  setRequestPage(1);
                }}
                statuses={["Available", "Low Stock", "Out of Stock"]}
                onReset={() => {
                  setSearch("");
                  setSelectedCategory("");
                  setSelectedStatus("");
                  setRequestPage(1);
                }}
              />
              
              <RequestStockTable
                products={paginatedProducts}
                onRequestItem={handleRequestItem}
              />
              
              <Pagination
                currentPage={requestPage}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                label="Products"
                onPageChange={setRequestPage}
              />
              
              <CurrentRequestCard
                request={currentRequest}
                remarks={remarks}
                onRemarksChange={setRemarks}
                onRemoveItem={handleRemoveItem}
                onClearRequest={handleClearRequest}
                onSubmitRequest={handleSubmitRequest}
                submitting={submitting}
              />
            </>
          )}

          {activeTab === "Requested Stock" && (
            <>
              <RequestStockFilters
                search={search}
                onSearchChange={(val) => {
                  setSearch(val);
                  setRequestedPage(1);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(val) => {
                  setSelectedStatus(val);
                  setRequestedPage(1);
                }}
                statuses={["Pending", "Approved", "Partially_Approved", "Rejected"]}
                showCategory={false}
                onReset={() => {
                  setSearch("");
                  setSelectedStatus("");
                  setRequestedPage(1);
                }}
              />
              
              <RequestedStockTable
                requests={paginatedRequests}
                onViewRequest={handleViewRequestDetails}
              />
              
              <Pagination
                currentPage={requestedPage}
                totalItems={filteredRequests.length}
                itemsPerPage={itemsPerPage}
                label="Requests"
                onPageChange={setRequestedPage}
              />
            </>
          )}

          {activeTab === "Received Stock" && (
            <>
              <RequestStockFilters
                search={search}
                onSearchChange={(val) => {
                  setSearch(val);
                  setReceivedPage(1);
                }}
                showCategory={false}
                showStatus={false}
                onReset={() => {
                  setSearch("");
                  setReceivedPage(1);
                }}
              />
              
              <ReceivedStockTable
                receivedStocks={paginatedReceived}
                onViewRequest={handleViewRequestDetails}
                onReceiveRequest={async (req) => {
                  setLoadingDetails(true);
                  try {
                    const res  = await fetch(`${API_BASE}/distributor/supply-requests.php?id=${req.request_id}`, {
                      headers: { Authorization: `Bearer ${auth?.token}` },
                    });
                    const json = await res.json();
                    if (json.success) setReceiveTarget(json.data);
                  } catch { /* silent */ }
                  finally { setLoadingDetails(false); }
                }}
              />
              
              <Pagination
                currentPage={receivedPage}
                totalItems={filteredReceived.length}
                itemsPerPage={itemsPerPage}
                label="Records"
                onPageChange={setReceivedPage}
              />
            </>
          )}
        </>
      )}

      {/* View Request Details Modal */}
      {viewRequest && (
        <RequestDetailsModal
          request={viewRequest}
          onClose={() => setViewRequest(null)}
        />
      )}

      {/* Receive Stock Confirmation Modal */}
      {receiveTarget && (
        <ReceiveStockModal
          request={receiveTarget}
          onClose={() => setReceiveTarget(null)}
          onReceived={handleReceiveConfirmed}
        />
      )}

      {loadingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <Loader2 className="animate-spin text-white" size={36} />
        </div>
      )}
    </div>
  );
}
