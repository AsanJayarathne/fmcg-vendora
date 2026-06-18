const tabs = ["All Drivers", "Pending Approval", "Approved", "Rejected"];

export default function DriverTabs() {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`px-8 py-4 text-sm font-semibold capitalize ${
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