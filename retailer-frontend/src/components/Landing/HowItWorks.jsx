// src/components/landing/HowItWorks.jsx

import {
  FiUserPlus,
  FiShoppingCart,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus size={32} />,
    title: "Register Your Shop",
    description:
      "Create your retailer account and complete your business profile within minutes.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <FiShoppingCart size={32} />,
    title: "Browse & Place Orders",
    description:
      "Search products from trusted distributors and place orders with flexible payment options.",
    color: "bg-orange-100 text-orange-500",
  },
  {
    icon: <FiTruck size={32} />,
    title: "Receive Deliveries",
    description:
      "Track every order in real time and receive deliveries directly at your store.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: <FiCheckCircle size={32} />,
    title: "Grow with Analytics",
    description:
      "Use powerful reports and insights to improve inventory, spending, and profitability.",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            How It Works
          </span>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Start Selling Smarter in 4 Simple Steps
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            From registration to business growth,
            Vendora makes every step simple and efficient.
          </p>

        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 mt-20">

          {steps.map((step, index) => (
            <div key={index} className="relative">

              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-[2px] bg-slate-200 -translate-x-5"></div>
              )}

              <div className="bg-slate-50 rounded-[32px] p-8 text-center border border-slate-200 hover:shadow-xl transition">

                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${step.color}`}
                >
                  {step.icon}
                </div>

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mt-6">
                  {index + 1}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 text-slate-600 leading-7">
                  {step.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}