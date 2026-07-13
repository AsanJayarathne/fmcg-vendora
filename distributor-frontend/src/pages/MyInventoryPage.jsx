import { useState, useEffect, useMemo } from "react";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import Pagination from "../components/Pagination";
import BatchDetailsTable from "../components/inventory/BatchDetailsTable";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";
import { Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function MyInventoryPage() {
  const { auth } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected item details state
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchStock = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/distributor/stock.php`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStockItems(data.data || []);
      } else {
        setError(data.message || "Failed to load inventory stock.");
      }
    } catch (err) {
      setError("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchStock();
    }
  }, [auth?.token]);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const list = stockItems.map((item) => item.category_name).filter(Boolean);
    return [...new Set(list)].sort();
  }, [stockItems]);

  const getStatus = (qty) => {
    if (qty <= 0) return "Out of Stock";
    if (qty <= 20) return "Low";
    return "Good";
  };

  // Filter stock logic
  const filteredStock = useMemo(() => {
    return stockItems.filter((item) => {
      const code = `PRD-${String(item.product_id).padStart(3, '0')}`;
      const matchesSearch =
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory
        ? item.category_name === selectedCategory
        : true;

      const status = getStatus(item.quantity);
      const matchesStatus = selectedStatus
        ? (selectedStatus === "Low" ? status === "Low" : (selectedStatus === "Out of Stock" ? status === "Out of Stock" : status === "Good"))
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stockItems, search, selectedCategory, selectedStatus]);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  // Paginated stock
  const paginatedStock = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStock.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStock, currentPage]);

  // Dynamic batch details array
  const batchDetails = useMemo(() => {
    if (!selectedProduct) return [];
    
    // Find active record in original stockItems to make sure we show updated values
    const activeProduct = stockItems.find((item) => item.product_id === selectedProduct.product_id);
    if (!activeProduct) return [];

    const updatedDate = activeProduct.last_updated_at || activeProduct.updated_at;
    const formattedDate = updatedDate 
      ? new Date(updatedDate.replace(/-/g, "/")).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not Tracked";

    return [
      {
        batchNo: `BAT-${String(activeProduct.product_id).padStart(3, "0")}-001`,
        purchaseDate: formattedDate,
        expiryDate: "Not Tracked",
        qty: activeProduct.quantity,
        status: getStatus(activeProduct.quantity),
      },
    ];
  }, [selectedProduct, stockItems]);

  return (
    <div className="space-y-4 font-sans">
      <PageHeader
        title="Manage My Stock"
        subtitle="View and manage your current stock"
      />

      <InventoryFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setCurrentPage(1);
        }}
        categories={categories}
        onReset={handleResetFilters}
      />

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
          <InventoryTable
            items={paginatedStock}
            onSelectProduct={setSelectedProduct}
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

      <BatchDetailsTable
        title={
          selectedProduct
            ? `Batch Details - ${selectedProduct.product_name} (ID: ${selectedProduct.product_id})`
            : "Batch Details"
        }
        batches={batchDetails}
        selectedProduct={selectedProduct}
      />
    </div>
  );
}