import { useLanguage } from "../../context/LanguageContext";

function DistributorCard({ distributor, onView }) {
  const { t } = useLanguage();

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
        📍 {distributor.distance} {t("distributors.kmAway", "km away")}
      </p>

      <p>
        📦 {distributor.productsCount} {t("distributors.productsCount", "Products")}
      </p>

      <p className="text-green-600">
        🟢 {t("distributors.activeStatus", "Active")}
      </p>

      <button
        onClick={() => onView(distributor.id)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {t("distributors.browseDistributorCatalog", "View Inventory")}
      </button>

    </div>
  );
}

export default DistributorCard;