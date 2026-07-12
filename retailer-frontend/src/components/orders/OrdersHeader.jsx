import { FiTruck } from "react-icons/fi";

function OrdersHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
        <FiTruck className="w-8 h-8" />
        <span>My Orders</span>
      </h1>
      <p className="text-gray-500 text-sm">
        Track distributor orders, payment details, and delivery status.
      </p>
    </div>
  );
}

export default OrdersHeader;
