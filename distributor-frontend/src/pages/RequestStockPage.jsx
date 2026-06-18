import RequestStockTabs from "../components/inventory/RequestStockTabs";
import RequestStockFilters from "../components/inventory/RequestStockFilters";
import RequestStockTable from "../components/inventory/RequestStockTable";
import RequestStockPagination from "../components/inventory/RequestStockPagination";
import CurrentRequestCard from "../components/inventory/CurrentRequestCard";

const products = [
  { name: "Item 1", productId: "PRD-01", availableStock: 2000, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 2", productId: "PRD-01", availableStock: 2300, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 3", productId: "PRD-01", availableStock: 2300, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 4", productId: "PRD-01", availableStock: 3000, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 5", productId: "PRD-01", availableStock: 4300, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 6", productId: "PRD-01", availableStock: 10000, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 7", productId: "PRD-01", availableStock: 1400, basePrice: 65.0, mrp: 75.0 },
  { name: "Item 8", productId: "PRD-01", availableStock: 2300, basePrice: 65.0, mrp: 75.0 },
];

const currentRequest = {
  requestId: "Request ID-001",
  items: [
    { product: "Item", qty: 2000, basePrice: 65, amount: 45000 },
    { product: "Item 2", qty: 2000, basePrice: 56, amount: 45000 },
    { product: "Item 3", qty: 2000, basePrice: 65, amount: 45000 },
    { product: "Item 3", qty: 2000, basePrice: 65, amount: 45000 },
  ],
};

export default function RequestStockPage() {
  return (
    <div className="space-y-4">
      <RequestStockTabs />

      <RequestStockFilters />

      <RequestStockTable products={products} />

      <RequestStockPagination start={1} end={8} total={178} />

      <CurrentRequestCard request={currentRequest} />
    </div>
  );
}