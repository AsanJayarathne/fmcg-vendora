import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/Layouts/Mainlayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Distributors from "./pages/Distributors";
import DistributorDetails from "./pages/DistributorDetails";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import MyOrders from "./pages/MyOrders";
import Messages from "./pages/Messages";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/products" element={<Products />} />

        <Route path="/distributors" element={<Distributors />} />
        <Route path="/distributors/:id" element={<DistributorDetails />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/payment/:distributor" element={<Payment />} />

        <Route path="/orders" element={<MyOrders />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/messages" element={<Messages />} />

        <Route path="*" element={<Dashboard />} />

      </Routes>
    </MainLayout>
  );
}

export default App;
