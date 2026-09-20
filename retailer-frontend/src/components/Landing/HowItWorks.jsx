import {
  FiUserPlus,
  FiShoppingCart,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus size={28} />,
    title: "Register Your Shop",
    description:
      "Create your retailer account and complete your business profile within minutes.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <FiShoppingCart size={28} />,
    title: "Browse & Place Orders",
    description:
      "Search products from trusted distributors and place orders with flexible payment options.",
    color: "bg-orange-100 text-orange-500",
  },
  {
    icon: <FiTruck size={28} />,
    title: "Receive Deliveries",
    description:
      "Track every order in real time and receive deliveries directly at your store.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: <FiCheckCircle size={28} />,
    title: "Grow with Analytics",
    description:
      "Use powerful reports and insights to improve inventory, spending, and profitability.",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto">
          <span className="text-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            How It Works
          </span>

          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Start Selling Smarter in 4 Simple Steps
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 leading-relaxed">
            From registration to business growth,
            Vendora makes every step simple and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-10 sm:mt-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting Line on desktop */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-[2px] bg-slate-200 -translate-x-5"></div>
              )}

              <div className="bg-slate-50 rounded-2xl sm:rounded-[32px] p-6 sm:p-8 text-center border border-slate-200 hover:shadow-xl transition h-full flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color}`}
                >
                  {step.icon}
                </div>

                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-5 shadow-xs">
                  {index + 1}
                </div>

                <h3 className="mt-4 text-lg sm:text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
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