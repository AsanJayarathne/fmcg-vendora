const tabs = ["Request Stock", "Requested Stock", "Received Stock"];

export default function RequestStockTabs() {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`px-8 py-4 text-sm font-semibold ${
            index === 0
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}