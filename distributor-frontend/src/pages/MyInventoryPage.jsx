import { useState } from "react";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import Pagination from "../components/Pagination";
import BatchDetailsTable from "../components/inventory/BatchDetailsTable";
import PageHeader from "../components/PageHeader";

const inventoryItems = [
  {
    name: "Item 1",
    code: "ORD-01",
    productId: "A",
    availableStock: 2000,
    status: "Good",
    expired: "50",
  },
  {
    name: "Item 2",
    code: "ORD-02",
    productId: "B",
    availableStock: 2300,
    status: "Good",
    expired: "---",
  },
  {
    name: "Item 6",
    code: "ORD-06",
    productId: "B",
    availableStock: 100,
    status: "Low",
    expired: "---",
  },
  {
    name: "Item 8",
    code: "ORD-08",
    productId: "B",
    availableStock: 2300,
    status: "Good",
    expired: "300",
  },
];

const batchDetails = [
  {
    batchNo: "BATCH-001",
    purchaseDate: "10 Jan 2025",
    expiryDate: "25 Jan 2028",
    qty: 1000,
    status: "Good",
  },
  {
    batchNo: "BATCH-002",
    purchaseDate: "20 March 2025",
    expiryDate: "25 April 2028",
    qty: 2500,
    status: "Good",
  },
  {
    batchNo: "BATCH-003",
    purchaseDate: "18 Jan 2025",
    expiryDate: "25 May 2028",
    qty: 1000,
    status: "Good",
  },
];

export default function MyInventoryPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-4">    
          <PageHeader
                title="Manage My Stock"
                subtitle="View And Manage your Current Stock"
              />
     
      <InventoryFilters />

      <InventoryTable items={inventoryItems} />

      <Pagination
        currentPage={currentPage}
        totalItems={178}
        itemsPerPage={8}
        label="Products"
        onPageChange={setCurrentPage}
      />

      <BatchDetailsTable
        title="Batch Details-Item(ID-010)"
        batches={batchDetails}
      />
    </div>
  );
}