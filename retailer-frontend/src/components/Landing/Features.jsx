import {
  FiBox,
  FiCreditCard,
  FiShoppingCart,
  FiTruck,
  FiBarChart2,
  FiRefreshCcw,
} from "react-icons/fi";

const features = [
  {
    title: "Smart Inventory",
    description:
      "Monitor stock levels in real-time and never run out of fast-moving products.",
    icon: <FiBox size={28} />,
    color: "bg-blue-100 text-blue-600",
    image: "Inventory Dashboard",
  },
  {
    title: "Flexible Credit",
    description:
      "Purchase products with distributor credit while tracking outstanding balances.",
    icon: <FiCreditCard size={28} />,
    color: "bg-emerald-100 text-emerald-600",
    image: "Credit Wallet",
  },
  {
    title: "Easy Ordering",
    description:
      "Browse thousands of FMCG products and place orders within seconds.",
    icon: <FiShoppingCart size={28} />,
    color: "bg-orange-100 text-orange-500",
    image: "Ordering Screen",
  },
  {
    title: "Live Delivery Tracking",
    description:
      "Know exactly where your orders are with real-time delivery updates.",
    icon: <FiTruck size={28} />,
    color: "bg-purple-100 text-purple-600",
    image: "Delivery Tracker",
  },
  {
    title: "Business Analytics",
    description:
      "Understand your sales, inventory movement and purchasing behaviour.",
    icon: <FiBarChart2 size={28} />,
    color: "bg-cyan-100 text-cyan-600",
    image: "Analytics Dashboard",
  },
  {
    title: "Quick Returns",
    description:
      "Request product returns or replacements directly through the platform.",
    icon: <FiRefreshCcw size={28} />,
    color: "bg-red-100 text-red-500",
    image: "Returns Management",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-slate-50">

      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Platform Features
          </span>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Everything You Need to Run Your Retail Business
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Vendora combines inventory, ordering, delivery, credit,
            and analytics into one powerful platform designed
            specifically for FMCG retailers.
          </p>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">

          {features.map((feature, index) => (

            <div
              key={index}
              className="
              bg-white
              rounded-[32px]
              overflow-hidden
              border
              border-slate-200
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-2
              transition
              duration-300"
            >

              {/* Image Placeholder */}

              <div className="h-56 bg-slate-100 border-b border-dashed border-slate-300 flex items-center justify-center">

                <div className="text-center">

                  <div className="text-5xl mb-4">
                    🖼️
                  </div>

                  <p className="text-slate-500 font-medium">
                    {feature.image}
                  </p>

                </div>

              </div>

              {/* Content */}

              <div className="p-8">

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mt-6">
                  {feature.title}
                </h3>

                <p className="text-slate-600 mt-4 leading-8">
                  {feature.description}
                </p>

                <button className="mt-8 text-blue-600 font-semibold hover:underline">
                  Learn More →
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}