import { useLanguage } from "../../context/LanguageContext";

function SearchBar({ searchTerm, setSearchTerm }) {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder={t("products.searchPlaceholder", "Search products...")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;