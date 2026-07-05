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
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login.jsx";
import RegisterStep1 from "./pages/RegisterStep1.jsx";
import RegisterStep2 from "./pages/RegisterStep2.jsx";

function App() {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<RegisterStep1 />} />
      <Route path="/register-step2" element={<RegisterStep2 />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="*"
        element={
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
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
