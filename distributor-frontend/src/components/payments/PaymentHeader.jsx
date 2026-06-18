export default function PaymentHeader({
  title,
  subtitle,
}) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h2 className="text-lg font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}