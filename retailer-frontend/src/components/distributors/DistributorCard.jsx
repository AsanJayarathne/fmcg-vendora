function DistributorCard({ distributor, onView }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">

      <div className="flex justify-between">

        <h3 className="font-bold text-lg">
          {distributor.name}
        </h3>

        <span>
          ⭐ {distributor.rating}
        </span>

      </div>

      <p className="mt-2">
        📍 {distributor.distance} km away
      </p>

      <p>
        📦 {distributor.productsCount} Products
      </p>

      <p className="text-green-600">
        🟢 Active
      </p>

      <button
        onClick={() => onView(distributor.id)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        View Inventory
      </button>

    </div>
  );
}

export default DistributorCard;