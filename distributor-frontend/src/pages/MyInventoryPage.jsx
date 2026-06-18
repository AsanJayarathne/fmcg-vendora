import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryPagination from "../components/inventory/InventoryPagination";
import BatchDetailsTable from "../components/inventory/BatchDetailsTable";

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
  return (
    <div className="space-y-4">
         <div className="p-4 bg-white border border-gray-200 rounded-lg">
         <h2 className="text-lg font-bold text-gray-900">"Manage My Stock"</h2>
         <p className="text-xs text-gray-500">"View And Manage your Current Stock"</p>
        </div>
     
      <InventoryFilters />

      <InventoryTable items={inventoryItems} />

      <InventoryPagination start={1} end={8} total={178} />

      <BatchDetailsTable
        title="Batch Details-Item(ID-010)"
        batches={batchDetails}
      />
    </div>
  );
}