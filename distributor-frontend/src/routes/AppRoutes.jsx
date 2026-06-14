import { Routes, Route } from "react-router-dom";
import DistributorLayout from "../layout/DistributorLayout";

import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DistributorLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}