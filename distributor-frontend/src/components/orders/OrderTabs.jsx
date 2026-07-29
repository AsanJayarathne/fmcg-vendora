export default function OrderTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
            activeTab === tab
              ? "bg-white text-blue-600 shadow-2xs font-bold border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}