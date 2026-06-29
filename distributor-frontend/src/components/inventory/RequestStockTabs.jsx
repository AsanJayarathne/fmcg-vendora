const tabs = [
  "Request Stock",
  "Requested Stock",
  "Received Stock",
];

export default function RequestStockTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-8 py-4 text-sm font-semibold transition ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-black hover:text-blue-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}