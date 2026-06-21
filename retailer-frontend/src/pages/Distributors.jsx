import distributors from "../data/distributors.js";
import DistributorCard from "../components/distributors/DistributorCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "../components/products/SearchBar";

function Distributors() {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDistributors = distributors.filter(
    (distributor) =>
      distributor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => {
    navigate(`/distributors/${id}`);
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Distributors
      </h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredDistributors.map((distributor) => (
          <DistributorCard
            key={distributor.id}
            distributor={distributor}
            onView={handleView}
          />
        ))}

      </div>

    </div>
  );
}

export default Distributors;