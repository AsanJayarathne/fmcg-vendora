function StatusBadge({ status }) {
  const styles = {
    Delivered: 'bg-green-100 text-green-700',
    Returned: 'bg-red-100 text-red-600',
    Pending: 'bg-yellow-100 text-yellow-700',
    Available: 'bg-purple-100 text-purple-600',
    Claimed: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default StatusBadge;