export default function OrderTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition capitalize ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}