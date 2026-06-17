import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import DistributorLayout from "../layout/DistributorLayout";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/Product";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DistributorLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="product" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}