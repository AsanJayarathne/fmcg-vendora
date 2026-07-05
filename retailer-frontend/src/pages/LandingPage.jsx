import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Store,
  BarChart3,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 border-b">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            V
          </div>
          <h1 className="text-2xl font-bold">VENDORA</h1>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <a href="#how" className="hover:text-blue-600">How It Works</a>
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#pricing" className="hover:text-blue-600">Pricing</a>
          <a href="#about" className="hover:text-blue-600">About Us</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-xl font-semibold"
          >
            Register
          </Link>

          <Link
            to="/login"
            className="px-6 py-2 text-white bg-blue-600 rounded-xl font-semibold"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-10 py-20 items-center">
        <div>
          <h2 className="text-6xl font-bold leading-tight">
            We Make FMCG <br />
            Distribution <br />
            Smarter
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Vendora helps distributors, retailers, and delivery drivers manage
            orders, stock, payments, and deliveries in one simple platform.
          </p>

          <div className="flex gap-4 mt-8">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-72 px-5 py-3 border rounded-full outline-none"
            />

            <button className="flex items-center gap-2 px-7 py-3 text-white bg-blue-600 rounded-full font-semibold">
              Let’s Start
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative h-[500px]">
          <div className="absolute top-10 left-16 w-72 h-40 bg-blue-100 rounded-full flex items-center justify-center">
            <Store size={70} className="text-blue-600" />
          </div>

          <div className="absolute top-8 right-20 w-44 h-44 bg-yellow-300 rounded-full flex items-center justify-center">
            <Package size={70} className="text-yellow-700" />
          </div>

          <div className="absolute top-56 left-20 w-52 h-36 bg-purple-600 rounded-full flex items-center justify-center">
            <Truck size={70} className="text-white" />
          </div>

          <div className="absolute bottom-16 left-16 w-44 h-44 bg-gray-100 rounded-full flex items-center justify-center">
            <BarChart3 size={70} className="text-blue-600" />
          </div>

          <div className="absolute bottom-14 right-40 w-44 h-44 bg-lime-300 rounded-full flex items-center justify-center">
            <CreditCard size={70} className="text-green-700" />
          </div>

          <div className="absolute bottom-14 right-0 w-44 h-44 bg-orange-300 rounded-full flex items-center justify-center">
            <ShieldCheck size={70} className="text-orange-700" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-10 py-20 bg-gray-50">
        <div className="text-center">
          <h2 className="text-4xl font-bold">How Vendora Works</h2>
          <p className="mt-3 text-gray-600">
            Simple workflow for distributors and retailers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            "Retailer places an order",
            "Distributor approves and manages stock",
            "Driver delivers and updates status",
          ].map((item, index) => (
            <div key={item} className="p-8 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="mt-5 text-xl font-bold">{item}</h3>
              <p className="mt-3 text-gray-600">
                Vendora keeps the full order and delivery process organized and
                easy to track.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-10 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Our Services</h2>
          <p className="mt-3 text-gray-600">
            Everything needed for FMCG distribution management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: "Order Management",
              icon: <Package size={34} />,
              text: "Manage retailer orders, approvals, order history, and status updates.",
            },
            {
              title: "Inventory Tracking",
              icon: <Store size={34} />,
              text: "Track available stock, low stock alerts, expired products, and stock requests.",
            },
            {
              title: "Delivery Management",
              icon: <Truck size={34} />,
              text: "Assign drivers, monitor deliveries, and update delivery status.",
            },
            {
              title: "Payment Tracking",
              icon: <CreditCard size={34} />,
              text: "Track cash payments, credit payments, outstanding balances, and credit limits.",
            },
            {
              title: "Analytics Reports",
              icon: <BarChart3 size={34} />,
              text: "View sales trends, top products, retailer performance, and delivery insights.",
            },
            {
              title: "Secure Access",
              icon: <ShieldCheck size={34} />,
              text: "Role-based access for distributor, retailer, driver, and admin users.",
            },
          ].map((service) => (
            <div key={service.title} className="p-8 border rounded-2xl hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                {service.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
              <p className="mt-3 text-gray-600">{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-10 py-20 bg-gray-50">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Simple Pricing</h2>
          <p className="mt-3 text-gray-600">
            Start small and scale with your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {["Starter", "Business", "Enterprise"].map((plan, index) => (
            <div
              key={plan}
              className={`p-8 rounded-2xl border ${
                index === 1 ? "bg-blue-600 text-white scale-105" : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-bold">{plan}</h3>
              <p className="mt-4 text-4xl font-bold">
                {index === 0 ? "Free" : index === 1 ? "LKR 2,500" : "Custom"}
              </p>
              <p className="mt-2 opacity-80">per month</p>

              <div className="mt-6 space-y-3">
                {[
                  "Order management",
                  "Inventory tracking",
                  "Delivery updates",
                  "Payment reports",
                ].map((feature) => (
                  <p key={feature} className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    {feature}
                  </p>
                ))}
              </div>

              <button
                className={`w-full mt-8 py-3 rounded-xl font-semibold ${
                  index === 1
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold">About Vendora</h2>
            <p className="mt-5 text-gray-600 leading-8">
              Vendora is a centralized B2B order and supply management platform
              designed for FMCG distributors and retailers. It reduces manual
              order handling, improves stock visibility, tracks deliveries, and
              helps distributors manage payments and retailer credit efficiently.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="p-8 bg-blue-50 rounded-2xl">
              <h3 className="text-3xl font-bold text-blue-600">125+</h3>
              <p className="mt-2 text-gray-600">Retailers</p>
            </div>

            <div className="p-8 bg-green-50 rounded-2xl">
              <h3 className="text-3xl font-bold text-green-600">1500+</h3>
              <p className="mt-2 text-gray-600">Orders</p>
            </div>

            <div className="p-8 bg-yellow-50 rounded-2xl">
              <h3 className="text-3xl font-bold text-yellow-600">12+</h3>
              <p className="mt-2 text-gray-600">Drivers</p>
            </div>

            <div className="p-8 bg-purple-50 rounded-2xl">
              <h3 className="text-3xl font-bold text-purple-600">98%</h3>
              <p className="mt-2 text-gray-600">Delivery Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-8 text-center text-gray-500 border-t">
        © 2026 Vendora FMCG. All rights reserved.
      </footer>
    </div>
  );
}