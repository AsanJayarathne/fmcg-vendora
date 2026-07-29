export default function OrderTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 overflow-x-auto mb-6 pb-1 no-scrollbar">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
              isSelected
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}