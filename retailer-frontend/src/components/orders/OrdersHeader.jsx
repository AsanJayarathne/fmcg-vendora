import { FiTruck } from "react-icons/fi";

function OrdersHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FiTruck className="text-blue-500" />
          My Orders
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-normal">
          Track distributor orders, payment details, and live delivery status
        </p>
      </div>
    </div>
  );
}

export default OrdersHeader;
