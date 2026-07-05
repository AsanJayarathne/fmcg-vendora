function DistributorHeader({ distributor }) {

  if (!distributor) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">

      <div className="flex justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            {distributor.name}
          </h1>

          <p className="mt-2">
            ⭐ {distributor.rating}
          </p>

          <p>
            📍 {distributor.address}
          </p>

          <p>
            📞 {distributor.contact}
          </p>

          <p>
            🚚 {distributor.distance} km away
          </p>

        </div>

        <div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
            Active
          </span>

        </div>

      </div>

    </div>
  );
}

export default DistributorHeader;