export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}