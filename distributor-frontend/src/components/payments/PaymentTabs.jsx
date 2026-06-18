export default function PaymentTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex bg-white border border-gray-200 rounded-lg">
      <button
        onClick={() => setActiveTab("payments")}
        className={`px-6 py-4 text-sm font-semibold ${
          activeTab === "payments"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-800"
        }`}
      >
        All Payments
      </button>

      <button
        onClick={() => setActiveTab("outstanding")}
        className={`px-6 py-4 text-sm font-semibold ${
          activeTab === "outstanding"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-800"
        }`}
      >
        Outstanding
      </button>
    </div>
  );
}