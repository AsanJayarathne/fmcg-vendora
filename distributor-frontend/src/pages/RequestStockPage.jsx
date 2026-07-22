import { useState, useEffect, useMemo } from "react";

import RequestStockTabs from "../components/inventory/RequestStockTabs";
import RequestStockFilters from "../components/inventory/RequestStockFilters";
import RequestStockTable from "../components/inventory/RequestStockTable";
import RequestedStockTable from "../components/inventory/RequestedStockTable";
import ReceivedStockTable from "../components/inventory/ReceivedStockTable";
import Pagination from "../components/Pagination";
import CurrentRequestCard from "../components/inventory/CurrentRequestCard";
import PageHeader from "../components/PageHeader";
import RequestDetailsModal from "../components/inventory/RequestDetailsModal";
import ReceiveStockModal from "../components/inventory/ReceiveStockModal";
import { useAuth } from "../auth/AuthContext";
import { Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function RequestStockPage() {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("Request Stock");
  
  // Data State
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current request draft (cart) state
  const [currentRequest, setCurrentRequest] = useState({ items: [] });
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Detailed view request state
  const [viewRequest, setViewRequest] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [receiveTarget, setReceiveTarget] = useState(null);  // request to mark as Received

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Pagination State
  const [requestPage, setRequestPage] = useState(1);
  const [requestedPage, setRequestedPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);
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
      const reqJson = await reqRes.json();

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
      // Map frontend items to API format (product_id, quantity)
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
        // Re-fetch requests
        const reqRes = await fetch(`${API_BASE}/distributor/supply-requests.php`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const reqJson = await reqRes.json();
        if (reqJson.success) setRequests(reqJson.data || []);

        setActiveTab("Requested Stock"); // Navigate to requests list
      } else {
        alert(json.message || "Failed to submit request.");
      }
    } catch (err) {
      alert("Network error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Filter Logics ────────────────────────────────────────────────────────

  // Products Tab Filtering
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

  // Sliced Products
  const paginatedProducts = useMemo(() => {
    const start = (requestPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, requestPage]);

  // Supply Requests (Tab 2) Filtering (exclude Delivered/Received)
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

  // Received History (Tab 3): requests with Partially_Approved status (stock transferred by admin)
  // Distributor can mark these as "Received" to acknowledge physical receipt.
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
    <div className="space-y-4 font-sans pb-10">
      <PageHeader
        title="Request Stock"
        subtitle="View and manage your supply requests from the manufacturer"
      />
      
      <RequestStockTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {successMsg && (
        <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg animate-fade-in font-semibold">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-lg">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
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
